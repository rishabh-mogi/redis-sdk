import Redis, { RedisOptions } from "ioredis";

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
    protected constructor(options?: RedisOptions) {
        this.options = options || { host: "10.107.241.113", port: 6379 };
        this.client = new Redis(this.options);
    }

    public static getInstance(options?: RedisOptions): RedisClient {
        if (!RedisClient.instance) {
            RedisClient.instance = new RedisClient(options);
        }
        return RedisClient.instance;
    }

    public getClient(): Redis {
        return this.client;
    }

    public async connect(): Promise<boolean> {
        if (!this.client) {
            console.warn("Redis client was not initialized, creating a new instance...");
            this.client = new Redis();
        }

        try {
            const response = await this.client.ping();
            console.log("Connected to Redis successfully with response:", response);
            return response === "PONG";
        } catch (error) {
            console.error("Redis connection error:", error);
            return false;
        }
    }

    public close(): void {
        this.client.quit();
    }
}
