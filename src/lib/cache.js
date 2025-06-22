const cache = new Map();

export const getCachedData = (key) => {
    const item = cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > item.ttl;
    return isExpired ? null : item.data;
};

export const setCachedData = (key, data, ttl = 1000 * 60 * 10) => { // default 10 mins
    cache.set(key, { data, timestamp: Date.now(), ttl });
};
