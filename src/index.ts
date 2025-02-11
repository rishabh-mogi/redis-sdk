export { RedisClient } from "./RedisClient";
export { APIRedisCache } from "./APIRedisCache";


// function mainModule(){

//     try {

//         const redisClient = RedisClient.getInstance();
//         redisClient.connect();

//         const apiRedisCache = new APIRedisCache("test-service", "dev");
//     }
//     catch(err) {
//         console.log("Facing Error while making instance of RedisClient and APIRedisCache");
//     }

// }
