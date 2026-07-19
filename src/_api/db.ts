import 'server-only';
import { neon } from '@neondatabase/serverless';

const db = neon(process.env.NEON_DATABASE_URL!);
export default db;
