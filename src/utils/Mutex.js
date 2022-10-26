const events = require("events");
const logger = require("./logger");

module.exports = class Mutex {
  locks = new Map();
  event = new events.EventEmitter();
  logger = logger;

  getEventName(key) {
    return "release:" + key;
  }

  lock(key) {
    this.logger.debug({
      message: "lock status",
      object: "Mutex",
      method: "lock",
    });
    this.locks.set(key, true);
  }
  isLocked(key) {
    const keyIsLocked = !!this.locks.get(key);
    this.logger.debug({
      payload: keyIsLocked,
      message: "lock status",
      object: "Mutex",
      method: "isLocked",
    });
    return keyIsLocked;
  }
  release(key, value) {
    this.locks.delete(key);
    this.logger.debug({
      payload: { key, value },
      message: "deleted key",
      object: "Mutex",
      method: "release",
    });
    // const event = this.eventEmitters.get(key);
    this.event.emit(this.getEventName(key), null, value);
  }
  releaseError(key, error) {
    this.locks.delete(key);
    this.logger.debug({
      payload: { key, error },
      message: "deleted key",
      object: "Mutex",
      method: "releaseError",
    });
    // const event = this.eventEmitters.get(key);
    this.event.emit(this.getEventName(key), error, null);
  }
  async waitValue(key) {
    this.logger.debug({
      message: "waiting for " + key,
      object: "Mutex",
      method: "waitValue",
    });
    return new Promise((resolve, reject) => {
      this.event.once(this.getEventName(key), (error, value) => {
        if (error) {
          return reject(error);
        }
        return resolve(value);
      });
    });
  }
};
