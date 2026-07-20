import mongoose from 'mongoose';
import { env } from './env.js';

/**
 * Connect to MongoDB. Called from server.js at boot.
 * The connection URI is read from the environment — never hard-coded.
 */
export async function connectDB(uri = env.mongoUri) {
  mongoose.set('strictQuery', true);
  const conn = await mongoose.connect(uri, {
    autoIndex: !env.isProd, // build indexes automatically outside production
  });
  // eslint-disable-next-line no-console
  console.log(`[db] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
