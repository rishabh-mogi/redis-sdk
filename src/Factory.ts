import KeyObject from "./models/keyObject.model";

export function GenerateRedisKey(
  serviceName: string,
  keyObject: KeyObject
): string {
  try {
    if (serviceName == "" || serviceName == null) {
      throw new Error("Invalid serviceName");
    }

    if (keyObject?.key == "" || keyObject?.key == null) {
      throw new Error("Invalid Key");
    }

    let { appId, key, dataByIds, keys } = keyObject;

    if (keys == null || keys == undefined) {
      keys = [];
    }
    keys?.sort();

    let finalKey = serviceName;

    if (appId) finalKey += `:${appId}`;

    if (dataByIds?.length) {
      dataByIds.sort((data1, data2) => data1.type.localeCompare(data2.type));
      dataByIds.forEach((data) => {
        finalKey += `:${data.type}::${data.id}`;
      });
    }

    for (const _key of keys) {
      finalKey += `:${_key}`;
    }
    finalKey += `:${key}`;
    return finalKey;
  } catch (error) {
    throw new Error("Invalid keyObject");
    return "";
  }
}

export function generateDeleteKeysExpression(
  serviceName: string = "*",
  appId: string = "*",
  key: string = "*",
  userId: string = "*"
) {
  try {
    if (serviceName == "" || serviceName == null) {
      throw new Error("Invalid serviceName");
      return "";
    }

    if (serviceName == "*") {
      return "*";
    } else if (appId == "*") {
      return `${serviceName}:*`;
    } else if (userId == "*") {
      return `${serviceName}:${appId}:*`;
    } else if (key == "*") {
      return `${serviceName}:${appId}:${userId}:*`;
    }
    return `${serviceName}:${appId}:${userId}:${key}`;
  } catch (error) {
    throw new Error("Error deleting key");
    return "";
  }
}
