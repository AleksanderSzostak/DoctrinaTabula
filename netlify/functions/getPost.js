import { neon } from '@netlify/neon';

export const handler = async (event, context) => {
  const sql = neon(); // NETLIFY_DATABASE_URL is used automatically
  const id = event.queryStringParameters.id || 1;

  const [post] = await sql`SELECT * FROM fiszki WHERE id = ${id}`;

  return {
    statusCode: 200,
    body: JSON.stringify(post)
  };
};
