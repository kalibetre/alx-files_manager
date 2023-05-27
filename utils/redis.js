import { createClient } from 'redis';
import { promisify } from 'util';

/**
 * A Redis client class that can be used to interact with Redis.
 */
class RedisClient {
  constructor() {
    this.client = createClient();

    this.client.on('error', (err) => {
      console.log('Redis Client Error', err);
    });

    this.asyncSet = promisify(this.client.set).bind(this.client);
    this.asyncGet = promisify(this.client.get).bind(this.client);
    this.asyncDel = promisify(this.client.del).bind(this.client);
    this.asyncExpire = promisify(this.client.expire).bind(this.client);
  }

  /**
   * Determines if the client is alive by pinging it.
   *
   * @return {boolean} Returns true if the client is alive, false otherwise.
   */
  isAlive() {
    try {
      this.client.ping();
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Sets a key-value pair and sets an expiry time for the key.
   *
   * @param {string} key - the key to set the value for
   * @param {any} value - the value to set for the key
   * @param {number} expiry - the time in seconds for the key to expire
   * @return {Promise<void>} - a Promise that resolves when the key-value pair
   * is set and the expiry is set
   */
  async set(key, value, expiry) {
    await this.asyncSet(key, value);
    await this.asyncExpire(key, expiry);
  }

  /**
   * Retrieves the value associated with the given key.
   *
   * @param {string} key - the key to retrieve the value for
   * @return {*} the value associated with the given key
   */
  get(key) {
    return this.asyncGet(key);
  }

  /**
   * Deletes the specified key using asynchronous delete method.
   *
   * @param {any} key - the key to be deleted
   * @return {Promise} A promise that resolves after the deletion is complete
   */
  del(key) {
    return this.asyncDel(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
