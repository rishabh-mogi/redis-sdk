import { RedisClient } from "./RedisClient";
import { APIRedisCache } from "./APIRedisCache";


// function mainModule(){

//     try {

//         const redisClient = RedisClient.getInstance();
//         redisClient.connect();

//         const apiRedisCache = neRedisClientw APIRedisCache("test-service", "dev");
//     }
//     catch(err) {
//         console.log("Facing Error while making instance of RedisClient and APIRedisCache");
//     }

// }


module.exports = {
    RedisClient,
    APIRedisCache
}