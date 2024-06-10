import { Db, MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27018';
const dbName = process.env.MONGODB_DB || 'libra';
const options = {};

let client: MongoClient;
let db: Db;

if (!uri || !dbName) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local',
  );
}

export default async function connectToDatabase() {
  client = await MongoClient.connect(uri, options);
  db = client.db(dbName);
  return { client, db };
}
