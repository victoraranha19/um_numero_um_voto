import 'server-only';
import { Pool, QueryResult, QueryResultRow } from 'pg';

declare global {
  var pgPool: Pool | undefined;

  interface ProcessEnv {
    DB_HOST: string;
    DB_NAME: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_PORT?: string;
    DB_CA_CERTIFICATE?: string;
  }

  interface Global {
    pgPool?: Pool;
  }
}

interface Database {
  query<T extends QueryResultRow>(
    text: string,
    params?: unknown[],
  ): Promise<QueryResult<T>>;
  getPool(): Pool;
  end(): Promise<void>;
}

const poolConfig = {
  max: 10, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection could not be established
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
  ssl: process.env.DB_CA_CERTIFICATE
    ? {
        rejectUnauthorized: true,
        ca: process.env.DB_CA_CERTIFICATE,
      }
    : undefined,
};

const getPool = (): Pool => {
  if (!global.pgPool) {
    global.pgPool = new Pool(poolConfig);

    global.pgPool.on('error', (err) => {
      console.error('Erro inesperado no cliente:', err);
      process.exit(-1);
    });

    if (process.env.NODE_ENV !== 'production') {
      process.on('SIGINT', async () => {
        if (global.pgPool) {
          await global.pgPool.end();
        }
        process.exit(0);
      });
    }
  }

  return global.pgPool;
};

const initDb = async (): Promise<void> => {
  const pool = getPool();
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS votos (
    id SERIAL PRIMARY KEY,
    presidente VARCHAR(255) NOT NULL,
    data_voto TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `;
  try {
    await pool.query(createTableQuery);
    console.log('Banco de dados inicializado com sucesso.');
  } catch (error) {
    console.error('Erro inicializando banco de dados:', error);
    throw error;
  }
};

initDb().catch((error) => {
  console.error('Erro ao inicializar o banco de dados:', error);
  process.exit(1);
});

const db: Database = {
  query: async <T extends QueryResultRow>(
    text: string,
    params?: unknown[],
  ): Promise<QueryResult<T>> => {
    const pool = getPool();
    return pool.query<T>(text, params);
  },
  getPool,
  end: async (): Promise<void> => {
    if (global.pgPool) {
      await global.pgPool.end();
      global.pgPool = undefined;
    }
  },
};

export default db;
