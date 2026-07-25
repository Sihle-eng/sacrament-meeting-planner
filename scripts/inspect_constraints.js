const fs = require('fs');
const path = require('path');
const envPath = path.join(process.cwd(), '.env.local');
const env = {};
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach((line) => {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) env[m[1]] = m[2];
  });
}
const DATABASE_URL = process.env.DATABASE_URL || env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL missing');
  process.exit(1);
}
const { neon } = require('@neondatabase/serverless');
const sql = neon(DATABASE_URL);
(async () => {
  try {
    const rows = await sql.query("SELECT conname, pg_get_constraintdef(oid) AS def FROM pg_constraint WHERE conrelid = 'meetings'::regclass");
    fs.writeFileSync('.next/constraints.json', JSON.stringify(rows, null, 2));
    console.log('Wrote .next/constraints.json');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
