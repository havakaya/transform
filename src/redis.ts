import bluebird from 'bluebird';
import Redis, { RedisClient } from 'redis';
import { QueueTimelines } from './types';

const once = require('lodash.once');
const debug = require('debug')('server:redis');

export const redis: () => RedisClient = once(Redis.createClient);

export const redisAsync: any = once(() => bluebird.promisifyAll(redis()));

export const redisMulti: any = () => bluebird.promisifyAll(redis().multi());

export async function redisGetAndDel(key: string) {
  const [value, _] = await redisMulti()
    .get(key)
    .del(key)
    .execAsync();
  return value;
}

export function duplicateRedis(): RedisClient {
  return redis().duplicate();
}

export function existsInRedis(key: string) {
  return redisAsync().existsAsync(key);
}

export function redisEnque(queue: string, args: string[]): Promise<string> {
  return redisAsync().sendCommandAsync('XADD', [queue, '*', ...args]);
}

export function redisRange(queue: string, startAt: string) {
  return redisAsync().sendCommandAsync('XRANGE', [queue, startAt, '+']);
}

export function redisReadQueue(watching: string[], timeout: number) {
  return redisAsync().sendCommandAsync('XREAD', [
    'BLOCK',
    timeout,
    'STREAMS',
    ...watching
  ]);
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

export const enum RedisKeys {
  STATE_EVENTS = 'room:state:',
  MESSAGE_EVENTS = 'room:message:',

  ROOM_PENDING = 'room:pending:',
  ROOM_ALIAS = 'room:alias:',

  USER_PRESENCE = 'user:presence:',
  USER_ACTIVITY = 'user:activity:',
  USER_STATUS = 'user:status:',
  USER_FILTER = 'user:filter:',

  SINCE = 'since:'
}
