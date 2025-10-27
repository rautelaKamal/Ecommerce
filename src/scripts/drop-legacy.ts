import * as dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

async function main() {
  dotenv.config({ path: '.env.local' });
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('[drop-legacy] Missing DATABASE_URL in .env.local');
    process.exit(1);
  }
  const sql = neon(url);

  const drops = [
    'drop table if exists product_images cascade;',
    'drop table if exists product_variants cascade;',
    'drop table if exists products cascade;',
  ];

  try {
    console.log('[drop-legacy] Connecting and dropping legacy tables...');
    for (const q of drops) {
      console.log('[drop-legacy] Executing:', q);
      await sql.query(q);
    }
    console.log('[drop-legacy] Done.');
  } catch (e) {
    console.error('[drop-legacy] Error:', e);
    process.exit(1);
  }
}

main();
