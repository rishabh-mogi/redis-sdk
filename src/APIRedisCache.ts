import Redis, { RedisOptions }  from "ioredis";
import { RedisClient } from "./RedisClient";
import { Request, Response, NextFunction } from "express";

export class APIRedisCache extends RedisClient {
    private service: string;
    private environment: string;

    constructor(serviceName: string = "unknown", environment: string = "dev",options?: RedisOptions) {
        super(); // Call RedisClient constructor
        this.service = serviceName;
        this.environment = environment;
        if(!this.client) {
            console.warn("Redis client was not initialized, creating a new instance...");
            this.client = new Redis({host:'10.107.241.113',post:6379});
        }
    }

    /**
     * Express middleware for handling Redis caching.
     * - **GET** → Checks if cached data exists and returns it.
     * - **POST** → Stores new data in the cache.
     * - **PUT** → Updates existing cache data.
     * - **DELETE** → Removes data from the cache.
     */
    public cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        // const cacheRequired = req.headers["cache-reAPIRedisCachequired"]; // Check if caching is enabled
        // if (!cacheRequired) return next(); // Skip if no cache is required

        const cacheKey = req.originalUrl; // Unique cache key based on endpoint URL

        try {
            switch (req.method) {
                case "GET":
                    // Fetch from cache if exists
                    const cachedData = await this.client.get(cacheKey);
                    if (cachedData) {
                        console.log(`Cache hit for ${cacheKey}`);
                        return res.send(JSON.parse(cachedData));
                    }
                    console.log(`Cache miss for ${cacheKey}`);
                    break;

                case "POST":
                    // Capture response and store in cache
                    this.storeCache(req, res, cacheKey);
                    break;

                case "PUT":
                    // Update cache with new response
                    this.storeCache(req, res, cacheKey);
                    break;

                case "DELETE":
                    // Delete cache key
                    await this.client.del(cacheKey);
                    console.log(`Cache deleted for ${cacheKey}`);
                    break;
            }
        } catch (error) {
            console.error("Redis cache error:", error);
        }

        next(); // Proceed to actual request handler
    };

    /**
     * Captures the response and stores it in Redis cache.
     */
    private storeCache(req: Request, res: Response, cacheKey: string) {
        // const oldSend = res.json;
        // res.json = async (body: any) => {
        //     try {
        //         await this.client.set(cacheKey, JSON.stringify(body), "EX", 3600); // Cache for 1 hour
        //         console.log(`Cache stored for ${cacheKey}`);
        //     } catch (error) {
        //         console.error("Error storing cache:", error);
        //     }
        //     return oldSend.call(res, body);
        // };
    }
}
