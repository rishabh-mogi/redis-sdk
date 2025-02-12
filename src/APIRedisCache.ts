import { RedisClient } from "./RedisClient";
import { Request, Response, NextFunction } from "express";

export class APIRedisCache {
    
    private client;
    constructor() {
        this.client = RedisClient.getInstance().getClient();
    }

    public cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        const cacheKey = req.originalUrl;
        console.log("🔵 Cache middleware called for:", cacheKey);

        try {
            if (req.method === "GET") {
                const cachedData = await this.client.get(cacheKey);
                if (cachedData) {
                    console.log("⚡ Returning cached data for", cacheKey);
                    return res.send(JSON.parse(cachedData));
                }
            } else if (["POST", "PUT"].includes(req.method)) {
                res.on("finish", async () => {
                    if (res.statusCode === 200) {
                        console.log("⚡ Caching response for", cacheKey);
                        await this.client.set(cacheKey, JSON.stringify(res.locals.data || {}), "EX", 3600);
                    }
                });
            } else if (req.method === "DELETE") {
                console.log("🚮 Deleting cache for", cacheKey);
                await this.client.del(cacheKey);
            }
        } catch (error) {
            console.error("❌ Redis cache error:", error);
        }

        next();
    };
}
