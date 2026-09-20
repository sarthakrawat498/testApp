import sql from 'mssql';
export declare function getDbPool(): Promise<sql.ConnectionPool>;
export declare function checkDatabaseConnection(): Promise<void>;
export declare function closeDbPool(): Promise<void>;
//# sourceMappingURL=pool.d.ts.map