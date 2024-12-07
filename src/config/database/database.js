import "dotenv/config";

const dbConfig = {
  logging: console.log,
  dialect: process.env.DB,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  define: {
    timestamps: true,
  },
  timezone: "-03:00",
};

export default dbConfig;
