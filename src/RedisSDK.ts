import { RedisOptions } from "ioredis";
import { RedisClient } from "./RedisClient";
import KeyObject from "./models/keyObject.model";
import { GenerateRedisKey } from "./Factory";

export class RedisSDK extends RedisClient {
    private service: string;
    private environment: string;

    /***
     * @example
     * const redisClient = new RedisSDK("myService", "prod");
     * @constructor
     * @param {string} serviceName - **(Required)** The name of the service using the Redis client by default unknown service.
     * @param {string} [environment] - The environment in which the service is running, like dev, qa, prod, stag etc.
     *
     * @description This class is used to interact with Redis. It provides methods to set, get, and delete values from Redis.
     * 
     */
    constructor(serviceName: string = "unknown", environment: string = "dev", options?: RedisOptions) {
        super(options); // Call the RedisClient constructor
        this.service = serviceName;
        this.environment = environment;
    }

    /**
     *  Set a value in Redis using a dynamically generated key.
     * 
     * @param {KeyObject} keyObject - The object used to construct the Redis key.
     * @param {string} keyObject.key - **(Required)** Unique identifier for the stored key.
     * @param {string} [keyObject.appId] - **(Optional)** AppID/WacID for App Identification.
     * @param {string} [keyObject.userId] - **(Optional)** User ID for personalization If Required.
     * @returns {Promise<boolean>} - Resolves to `true` if the value was successfully set, otherwise `false`.
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

            if (expireTime === null) {
                await this.client.set(key, data);
            } else {
                await this.client.set(key, data, "EX", expireTime);
            }

            return true;
        } catch (error) {
            console.error("Error setting key:", error);
            return false;
        }
    }

    /**
     * Retrieves a value from Redis using a dynamically generated key.
     *
     * @param {KeyObject} keyObject - The object used to construct the Redis key.
     * @returns {Promise<any>} - Resolves to the stored value if found, otherwise `null`.
     *
     */
    async getValue(keyObject: KeyObject): Promise<any> {
        try {
            const key: string = GenerateRedisKey(this.service, keyObject);
            const data = await this.client.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error("Error getting key:", error);
            return null;
        }
    }

    /**
     * Deletes a value from Redis using a dynamically generated key.
     * 
     * @param {KeyObject} keyObject - The object used to construct the Redis key.
     * @return {Promise<boolean>} - Resolves to `true` if the value was successfully deleted, otherwise `false`.
     * 
     */
    async deleteValue(keyObject: KeyObject): Promise<boolean> {
        try {
            const key: string = GenerateRedisKey(this.service, keyObject);
            await this.client.del(key);
            return true;
        } catch (error) {
            console.error("Error deleting key:", error);
            return false;
        }
    }

    /**
     * Checks if a key exists in Redis.
     * 
     * @param {KeyObject} keyObject - The object used to construct the Redis key.
     * @return {Promise<boolean>} - Resolves to `true` if the key exists, otherwise `false`.
     * 
     */
    async keyExists(keyObject: KeyObject): Promise<boolean> {
        try {
            const key: string = GenerateRedisKey(this.service, keyObject);
            const exists = await this.client.exists(key);
            return exists === 1;
        } catch (error) {
            console.error("Error checking key existence:", error);
            return false;
        }
    }

    /**
     * Deletes all keys related to a specific service.
     * 
     * @param {string} serviceName - The service name whose keys should be deleted.
     * @param {KeyObject} keyObject - The object used to construct the Redis key.
     * @return {Promise<boolean>} - Resolves to `true` if the keys were successfully deleted, otherwise `false`.
     * 
     */
    async globalKeysDeletion(serviceName: string, keyObject: KeyObject): Promise<boolean> {
        try {
            const keyPattern: string = GenerateRedisKey(serviceName, keyObject);
            const keys = await this.client.keys(`${keyPattern}*`);

            if (keys.length > 0) {
                await this.client.del(...keys);
            }

            return true;
        } catch (error) {
            console.error("Error deleting keys:", error);
            return false;
        }
    }

    /**
     * Closes the Redis connection.
     */
    close(): void {
        this.client.quit();
    }
}
