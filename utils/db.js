import { MongoClient } from 'mongodb';
import sha1 from 'sha1';

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

  /**
   * Finds a user by their email in the "users" collection.
   *
   * @param {string} email - The email of the user to find.
   * @return {Promise} A Promise that resolves with the user object, or null if
   * not found.
   */
  findUserByEmail(email) {
    return this.db.collection('users').findOne({ email });
  }

  /**
   * Adds a new user to the database with the given email and password.
   *
   * @param {string} email - The email of the user to add.
   * @param {string} password - The password of the user to add.
   * @return {Object} The user object that was added to the database, with the
   * password and _id fields removed.
   */
  async addUser(email, password) {
    const hashedPassword = sha1(password);
    const result = await this.db.collection('users').insertOne(
      {
        email,
        password: hashedPassword,
      },
    );
    result.ops[0].id = result.ops[0]._id;
    delete result.ops[0].password;
    delete result.ops[0]._id;
    return result.ops[0];
  }
}

const dBClient = new DBClient();
export default dBClient;
