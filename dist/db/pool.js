"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDbPool = getDbPool;
exports.checkDatabaseConnection = checkDatabaseConnection;
exports.closeDbPool = closeDbPool;
const mssql_1 = __importDefault(require("mssql"));
let poolPromise;
function connectionConfig() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString)
        throw new Error('DATABASE_URL is not configured');
    const rawConnectionString = connectionString.replace(/^sqlserver:\/\//i, '');
    const segments = rawConnectionString.split(';');
    const values = new Map();
    for (const segment of segments.slice(1)) {
        const separator = segment.indexOf('=');
        if (separator > 0)
            values.set(segment.slice(0, separator).toLowerCase(), segment.slice(separator + 1));
    }
    const [server, portText] = segments[0].split(':');
    if (!server)
        throw new Error('DATABASE_URL does not contain a server');
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
function getDbPool() {
    if (!poolPromise) {
        poolPromise = new mssql_1.default.ConnectionPool(connectionConfig()).connect().catch((error) => {
            poolPromise = undefined;
            throw error;
        });
    }
    return poolPromise;
}
async function checkDatabaseConnection() {
    const pool = await getDbPool();
    await pool.request().query('SELECT 1 AS [connected]');
}
async function closeDbPool() {
    if (poolPromise) {
        const pool = await poolPromise;
        await pool.close();
        poolPromise = undefined;
    }
}
//# sourceMappingURL=pool.js.map