import KeyObject from "./models/keyObject.model";

export function GenerateRedisKey(serviceName: string, keyObject: KeyObject):string {
  try {
    let finalKey = serviceName;
    const { key, appId, userId } = keyObject;

    if (appId && userId && key) {
      finalKey = `${finalKey}:${appId}:${userId}:${key}`;
    } else if (appId && key) {
      finalKey = `${finalKey}:${appId}:${key}`;
    } else if (appId) {
      finalKey = `${finalKey}:${appId}`;
    } else {
        throw new Error("Invalid keyObject");
    }
    return finalKey;
  } catch (error) {
    throw new Error("Invalid keyObject");
    return "";
  }
}

