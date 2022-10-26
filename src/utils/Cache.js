const Mutex = require("./Mutex");

module.exports = class Cache {
  constructor() {
    if (Cache.singleton) {
      return Cache.singleton;
    }

    this.pool = new Map();
    this.logger = console;
    Cache.singleton = this;
    this.mutext = new Mutex();
  }

  log(...args) {
    // eslint-disable-next-line no-console
    this.logger.info(args);
  }

  setLogger(logger) {
    this.logger = logger;
    return this;
  }

  async get(key) {
    try {
      if (this.mutext.isLocked(key)) {
        return await this.mutext.waitValue(key);
      }
      this.mutext.lock(key);
      const now = Date.now();
      this.log(`Accessing '${key}' content at ${now}`);
      const content = this.pool.get(key);
      if (!content) {
        this.mutext.release(key, null);
        return null;
      }
      this.log({ content });
      const isInfinity = content.expireAt === -1;
      const expired = content.expireAt < now;
      const shouldDelete = !isInfinity && expired;
      if (shouldDelete) {
        // eslint-disable-next-line no-console
        this.log(
          `Removing property '${key}' expired at ${content.expireAt} - now ${now}`
        );
        this.remove(key);
        this.mutext.release(key, null);
        return null;
      }
      const value = JSON.parse(content.value);
      this.mutext.release(key, value);
      return value;
    } catch (error) {
      this.mutext.releaseError(key, error);
      throw error;
    }
  }

  remove(key) {
    this.pool.delete(key);
    return this;
  }

  createValue(stringValue, options) {
    return {
      value: stringValue,
      expireAt: options.expireAt || -1,
      createdAt: Date.now(),
    };
  }

  async set(key, value, options = {}) {
    try {
      if (this.mutext.isLocked(key)) {
        await this.mutext.waitValue(key);
      }
      this.mutext.lock(key);
      const stringValue = JSON.stringify(value);
      this.log(`Setting key: ${key} value: ${stringValue}`);
      this.log(options);
      this.pool.set(key, this.createValue(stringValue, options));
      this.mutext.release(key);
      return;
    } catch (error) {
      this.mutext.releaseError(key, error);
      throw error;
    }
  }

  cleanAll() {
    this.log("Cleaning all data from cache");
    this.pool.clear();
    return this;
  }
};
