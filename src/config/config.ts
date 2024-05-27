export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER || 'postgres',
    name: process.env.DB_NAME || 'postgres',
    password: process.env.DB_PASSWORD || 'pg-pwd',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
  },
});
