import Redis, { RedisOptions } from "ioredis";
import dotenv from "dotenv";
dotenv.config();


export class RedisClient {
    private static instance: RedisClient;
    protected client: Redis;
    protected options: RedisOptions;

    /***
     * 
     * @constructor 
     * @param {RedisOptions} [options] - **(Optional)** The options to be used for creating the Redis client.
     * @param {string} [options.host] - **(Optional)** The host of the Redis server. Default is 127.0.0.1.
     * @param {number} [options.port] - **(Optional)** The port of the Redis server. Default is 6379.
     * 
     */
    public constructor() {
        this.options = {
            host: process.env.REDIS_IP || "127.0.0.1",
            port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
        };
        this.client = this.connect();

    }

    public connect(): Redis {
        try {
            this.client = new Redis(this.options);
            console.log(`Connecting to Redis at ${this.options.host}:${this.options.port}`);
            return this.client;
        } catch (error) {
            console.error("Unable to connect to Redis at", this.options.host, "on port", this.options.port, error);
            throw error;
        }
    }

    public static getInstance(): RedisClient {
        if (!RedisClient.instance) {
            RedisClient.instance = new RedisClient();
        }
        return RedisClient.instance;
    }

    public getClient(): Redis {
        if (!this.client) {
            throw new Error("Redis client is not initialized!");
        }
        return this.client;
    }

    public async isConnect(): Promise<boolean> {
        try {
            const response = await this.client.ping();
            return response === "PONG";
        } catch (error) {
            console.error("Redis connection error:", error);
            return false;
        }
    }

    public close(): void {
        if (this.client) {
            console.log("Closing Redis connection...");
            this.client.quit();
        }
    }
}
