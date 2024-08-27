import { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from 'pg';

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = new Client(config);

  try {
    await client.connect();
    const result = await client.query('SELECT VERSION()');
    await client.end();

    res.status(200).json({ version: result.rows[0].version });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Failed to connect to the database' });
  }
}