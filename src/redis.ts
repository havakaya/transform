import bluebird from 'bluebird';
import Redis, { RedisClient } from 'redis';

const once = require('lodash.once');
const debug = require('debug')('server:redis');

export function redis(): RedisClient {
  return once(() => {
    return Redis.createClient();
  })();
}

export function redisAsync() {
  return once(() => {
    return bluebird.promisifyAll(redis());
  })();
}

export function redisMulti(): any {
  return bluebird.promisifyAll(redis().multi());
}

export function duplicateRedis(): RedisClient {
  return redis().duplicate();
}

export function redisEnque(queue: string, args: string[]): Promise<string> {
  return redisAsync().sendCommandAsync('XADD', [queue, '*', ...args]);
}

export function initRedis() {
  return new Promise((res, rej) => {
    const _redis = redis();
    _redis.on('ready', () => {
      debug('redis:', _redis.server_info.redis_version);
      res('ready');
    });
  });
}
