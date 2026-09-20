import sql from 'mssql';

let poolPromise: Promise<sql.ConnectionPool> | undefined;

function connectionConfig(): sql.config {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not configured');

  const rawConnectionString = connectionString.replace(/^sqlserver:\/\//i, '');
  const segments = rawConnectionString.split(';');
  const values = new Map<string, string>();
  for (const segment of segments.slice(1)) {
    const separator = segment.indexOf('=');
    if (separator > 0) values.set(segment.slice(0, separator).toLowerCase(), segment.slice(separator + 1));
  }

  const [server, portText] = segments[0].split(':');
  if (!server) throw new Error('DATABASE_URL does not contain a server');

  return {
    server,
    port: portText ? Number(portText) : 1433,
    database: values.get('database'),
    user: values.get('user'),
    password: values.get('password'),
    connectionTimeout: Number(values.get('logintimeout') ?? 30) * 1000,
    options: {
      encrypt: values.get('encrypt') !== 'false',
      trustServerCertificate: values.get('trustservercertificate') === 'true'
    }
  };
}

export function getDbPool(): Promise<sql.ConnectionPool> {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(connectionConfig()).connect().catch((error: unknown) => {
      poolPromise = undefined;
      throw error;
    });
  }
  return poolPromise;
}

export async function checkDatabaseConnection(): Promise<void> {
  const pool = await getDbPool();
  await pool.request().query('SELECT 1 AS [connected]');
}

export async function closeDbPool(): Promise<void> {
  if (poolPromise) {
    const pool = await poolPromise;
    await pool.close();
    poolPromise = undefined;
  }
}