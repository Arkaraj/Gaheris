import { createPool } from 'mysql2';

const pool = createPool({
  host: 'localhost',
  user: 'root',
  database: '',
  password: '',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export default pool.promise();
