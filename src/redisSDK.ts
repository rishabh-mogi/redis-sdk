import Redis, { RedisOptions } from "ioredis";
import KeyObject from "./models/keyObject.model";
import { GenerateRedisKey } from "./factory";

export class RedisSDK {
  private client: Redis;
  private service: string;
  private environment: string;

  constructor(serviceName: string, environment: string = "dev") {
    const redisConfig: RedisOptions = { host: "127.0.0.1", port: 6379 , db: 0};
    this.client = new Redis(redisConfig);
    this.service = serviceName;
    this.environment = environment;
  }

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
