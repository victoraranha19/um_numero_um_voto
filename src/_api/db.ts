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

const createTableUsuariosQuery = `
  CREATE TABLE IF NOT EXISTS usuarios (
    email VARCHAR(100) PRIMARY KEY,
    nome VARCHAR(30) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    papel CHAR(1) DEFAULT 'C' NOT NULL,
    ativo BOOLEAN DEFAULT TRUE NOT NULL
  );
`;
const createTableTransacoesQuery = `
  CREATE TABLE IF NOT EXISTS transacoes (
    nsu VARCHAR(255) PRIMARY KEY,
    order_nsu VARCHAR(255) NOT NULL,
    url_recibo VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    valor_total INTEGER NOT NULL,
    valor_pago INTEGER NOT NULL,
    quantidade INTEGER NOT NULL,
    metodo_pagamento CHAR(1) NOT NULL,
    parcelas INTEGER DEFAULT 1 NOT NULL, 
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    foi_pago BOOLEAN DEFAULT FALSE NOT NULL,
    sucesso BOOLEAN DEFAULT FALSE NOT NULL,

    email_usuario VARCHAR(100) NOT NULL,
    FOREIGN KEY (email_usuario) REFERENCES usuarios(email)
  );
`;
const createTableCotasQuery = `
  CREATE TABLE IF NOT EXISTS cotas (
    numero INTEGER PRIMARY KEY,
    presidente CHAR(1) NOT NULL,
    premiada BOOLEAN DEFAULT FALSE,

    id_transacao VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_transacao) REFERENCES transacoes(nsu)
  );
`;

const initDb = async (): Promise<void> => {
  const pool = getPool();

  try {
    await pool.query(createTableUsuariosQuery);
    await pool.query(createTableTransacoesQuery);
    await pool.query(createTableCotasQuery);
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
