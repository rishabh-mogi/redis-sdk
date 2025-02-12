import { RedisClient } from "./RedisClient";
import { Request, Response, NextFunction } from "express";

export class APIRedisCache {
    
    private client;
    constructor() {
        this.client = RedisClient.getInstance().getClient();
    }

    public cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {

        const cacheKey = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        console.log("🔵 Cache middleware called for:", cacheKey);
        console.log("🔵 req.method is ",req.method);

        try {
            if (req.method === "GET") {
                const cachedData = await this.client.get(cacheKey);
                if (cachedData) {
                    console.log("⚡ Returning cached data for", cacheKey);
                    return res.send(JSON.parse(cachedData));
                }
            } else if (["POST", "PUT"].includes(req.method)) {
                console.log("REDIS:: POST Request :: ");
                res.on("finish", async () => {
                    console.log("🔵 Before Sending Response ",res.statusCode,res.locals.data);
                    if (res.statusCode === 200 || res.statusCode === 201) {
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
