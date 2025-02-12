import Redis from "ioredis";
import { RedisClient } from "./RedisClient";
import { Request, Response, NextFunction } from "express";

export class APIRedisCache extends RedisClient {
    constructor(private service: string = "unknown", private environment: string = "dev") {
        super();
        if (!this.client) this.connect();
    }

    public cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        const cacheKey = req.originalUrl;
        console.log("cache Middleware get Called ",this.cacheMiddleware)
        try {
            if (req.method === "GET") {
                const cachedData = await this.client.get(cacheKey);
                if (cachedData) return res.send(JSON.parse(cachedData));
            } else if (["POST", "PUT"].includes(req.method)) {
                console.log("cache Middleware get Called ",res.locals.data)
                res.on("finish", async () => {
                    if (res.statusCode === 200) {
                        await this.client.set(cacheKey, JSON.stringify(res.locals.data || {}), "EX", 3600);
                    }
                });
            } else if (req.method === "DELETE") {
                await this.client.del(cacheKey);
            }
        } catch (error) {
            console.error("Redis cache error:", error);
        }

        next();
    };
}
