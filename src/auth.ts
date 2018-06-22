import { UnauthorizedError } from 'routing-controllers';
import { User } from './model';
import { newToken, verifyToken } from './jwt';
import { getRepository } from 'typeorm';
import { ErrorTypes } from './types';

const auth = require('passport-local-authenticate');

const config = require('../config.json');
const debug = require('debug')('server:auth');

const passwordOptions = {
  digestAlgorithm: 'SHA256',
  iterations: 50000,
  keylen: 32,
  saltlen: 8,
  encoding: 'hex'
};

export async function authenticate(
  username: string,
  password: string,
  deviceId: string
): Promise<any> {
  const user = await getRepository(User).findOne({ user_id: username });
  if (!user) {
    throw new UnauthorizedError('user does not exist');
  }
  const [_, salt, hash] = user!.password_hash.split('$', 3);

  return new Promise<any>((resolve, reject) => {
    auth.verify(password, { salt, hash }, passwordOptions, function(
      err: any,
      verified: boolean
    ) {
      if (err || !verified) {
        reject(new UnauthorizedError('bad password')); // bad username or password
      }
      const jwt = newToken(user, deviceId);
      resolve({ user, jwt });
    });
  });
}

function hashPassword(password: string) {
  return new Promise<string>((resolve, reject) => {
    auth.hash(password, passwordOptions, (error: any, hashed: any) => {
      if (error) {
        reject('bad username or password');
      }
      const { salt, hash } = hashed;
      resolve(`pbkdf2:sha256:50000$${salt}$${hash}`);
    });
  });
}

async function newUser(username: string, password: string): Promise<User> {
  const pw = await hashPassword(password);
  let user = new User();
  user.home_server = config.server;
  user.user_id = username;
  user.password_hash = pw;
  return getRepository(User).save(user);
}

export interface SignedIn {
  user: User;
  jwt: string;
}

export async function signup(
  username: string,
  password: string,
  deviceId: string
): Promise<SignedIn> {
  const exists = await getRepository(User).count({ user_id: username });
  if (exists !== 0) {
    throw ErrorTypes.M_USER_IN_USE;
  }
  const user = await newUser(username, password);
  const jwt = newToken(user, deviceId);
  return { user, jwt };
}

export function tokenUser(token: string): Promise<User | undefined> {
  try {
    const { user_id } = verifyToken(token);
    return getRepository(User).findOneOrFail(
      { user_id },
      { select: ['id', 'user_id'] }
    );
  } catch (ex) {
    debug(ex.message);
    throw new UnauthorizedError(ex.message);
  }
}
