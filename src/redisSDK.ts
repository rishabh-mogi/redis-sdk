import Redis, { RedisOptions } from "ioredis";
import KeyObject from "./models/keyObject.model";
import { GenerateRedisKey } from "./factory";

export class RedisSDK {
  private client: Redis;
  private service: string;
  private environment: string;


  /***
   * @example
   * const redisClient = new RedisSDK("myService", "prod");
   * @constructor
   * @param {string} serviceName - **(Required)** The name of the service using the Redis client by default unknown service.
   * @param [environment] - The environment in which the service is running, like dev, qa, prod, stag etc.
   *
   * @description This class is used to interact with Redis. It provides methods to set, get, and delete values from Redis. 
   * 
   */
  constructor(serviceName: string = 'unknown', environment: string = "dev") {
    const redisConfig: RedisOptions = { host: "127.0.0.1", port: 6379, db: 0 };
    this.client = new Redis(redisConfig);
    this.service = serviceName;
    this.environment = environment;
  }

  /**
   * 
   * @example
   * const keyObject = { key: "session123", appId: "app456", userId: "user789" };
   * const value = { name: "John Doe", age: 30 };
   * const result = await redisClient.setValue(keyObject, value);
   * console.log(result); // Output: true if successful || false if failed
   * 
   *  Set a value in Redis using a dynamically generated key.
   * 
   * @param {KeyObject} keyObject - The object used to construct the Redis key.
   * @param {string} keyObject.key - **(Required)** Unique identifier for the stored key.
   * @param {string} [keyObject.appId] - **(Optional)** AppID/WacID for App Identification.
   * @param {string} [keyObject.userId] - **(Optional)** User ID for personalization If Required.
   * @returns {Promise<boolean>} - Resolves to `true` if the value was successfully set, otherwise `false`.
   *
   * @description This method sets a value in Redis based on the provided `keyObject`.
   * 
  */

  async setValue(
    keyObject: KeyObject,
    value: any,
    expireTime: number | null = null
  ): Promise<boolean> {
    try {
      const key: string = GenerateRedisKey(this.service, keyObject);
      const data = JSON.stringify(value);

      if (expireTime === null) this.client.set(key, data);
      else this.client.set(key, data, "EX", expireTime);

      return true;
    } catch (error) {
      console.error("Error setting key:", error);
      throw new Error("Error setting key");
      return false;
    }
  }


  /**
 * Retrieves a value from Redis using a dynamically generated key.
 *
 * @example
 * const keyObject = { key: "session123", appId: "app456", userId: "user789" };
 * const value = await redisClient.getValue(keyObject);
 * console.log(value); // Output: Stored value or null if not found
 * 
 * @param {KeyObject} keyObject - The object used to construct the Redis key.
 * @param {string} keyObject.key - **(Required)** Unique identifier for the stored key.
 * @param {string} [keyObject.appId] - **(Optional)** AppID/WacID for App Identification.
 * @param {string} [keyObject.userId] - **(Optional)** User ID for personalization If Required.
 * @returns {Promise<any>} - Resolves to the stored value if found, otherwise `null`.
 *
 * @description
 * This method fetches a value from Redis based on the provided `keyObject`. 
 * Ensure that the **same key structure** (key, appId, userId) is used when retrieving 
 * a key that was previously stored.
 *
 */

  async getValue(keyObject: KeyObject): Promise<any> {
    try {
      const key: string = GenerateRedisKey(this.service, keyObject);
      const data: any = await this.client.get(key);
      return JSON.parse(data);
    } catch (error) {
      console.error("Error getting key:", error);
      throw new Error("Error getting key");
      return null;
    }
  }



  /**
   * @example
   * const keyObject = { key: "session123", appId: "app456", userId: "user789" };
   * const result = await redisClient.deleteValue(keyObject);
   * console.log(result); // Output: true if successful || false if failed
   * 
   *  @param {KeyObject} keyObject - The object used to construct the Redis key.
   *  @return {Promise<boolean>} - Resolves to `true` if the value was successfully deleted, otherwise `false`.
   * 
   * @description This method deletes a value from Redis based on the provided `keyObject`.
   * 
  */

  async deleteValue(keyObject: KeyObject): Promise<boolean> {
    try {
      const key: string = GenerateRedisKey(this.service, keyObject);
      this.client.del(key);
      return true;
    } catch (error) {
      console.error("Error deleting key:", error);
      throw new Error("Error deleting key");
      return false;
    }
  }


  /**
   * @example
   * const keyObject = { key: "session123", appId: "app456", userId: "user789" };
   * const result = await redisClient.keyExists(keyObject);
   * console.log(result); // Output: true if key exists || false if not found
   * 
   * @param {KeyObject} keyObject - The object used to construct the Redis key.
   * @return {Promise<boolean>} - Resolves to `true` if the key exists, otherwise `false`.
   * 
   * @description This method checks if a key exists in Redis based on the provided `keyObject`.
   * 
  */
  async anotherServiceKey(
    serviceName: string,
    keyObject: KeyObject
  ): Promise<any> {
    try {
      const key: string = GenerateRedisKey(serviceName, keyObject);
    } catch (error) {
      console.error("Error getting key:", error);
      throw new Error("Error getting key");
      return null;
    }
  }

  close(): void {
    this.client.quit();
  }
}
