import { MongoClient } from 'mongodb';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';

/**
 * A MongoDB Client Class
 */
class DBClient {
  constructor() {
    this.client = new MongoClient(
      `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
    );
    this.isConnected = false;
    this.db = null;
    this.client.connect((err) => {
      if (!err) {
        this.isConnected = true;
        this.db = this.client.db(DB_DATABASE);
      }
    });
  }

  /**
   * Checks if the mongoDb client is alive.
   *
   * @return {boolean} The connection status of the mongoDb.
   */
  isAlive() {
    return this.isConnected;
  }

  /**
   * Asynchronously counts the num of documents in the "users" collection.
   *
   * @return {Promise<number>} The num of documents in the "users" collection.
   */
  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  /**
   * Calculates the number of files in the 'files' collection in the database.
   *
   * @return {Promise<number>} Returns a Promise that resolves to the number of
   * files in the 'files' collection.
   */
  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }
}

const dBClient = new DBClient();
export default dBClient;
