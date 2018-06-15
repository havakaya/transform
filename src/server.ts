const express: any = require('express');
const bearerToken = require('express-bearer-token');

import 'reflect-metadata';
import {
  useExpressServer,
  Action,
  UnauthorizedError
} from 'routing-controllers';

import routes from './client-server/routes';
import { initDb } from './model';
import { verifyToken } from './jwt';
import { tokenUser } from './auth';
import { initRedis } from './redis';
import { roomEvents } from './roomevents';

import * as logging from './logging';

const debug = require('debug')('server');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bearerToken());
app.use(logging.requestLogger);
app.use(logging.errorLogger);

async function init() {
  await initDb();
  await initRedis();
  // roomEvents();
  debug('initialized');
}

process.on('unhandledRejection', (reason, p) => {
  debug('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

init().catch(error => {
  debug('initialization', error);
  process.exit(-1);
});

useExpressServer(app, {
  // routePrefix: '/api2',
  cors: true,
  validation: { whitelist: true, skipMissingProperties: true },
  authorizationChecker: (action: Action, roles: string[]) => {
    const token = action.request.token;
    if (!token) {
      debug('missing token');
      return false;
    }
    try {
      verifyToken(token);
    } catch (ex) {
      debug(ex.message);
      return false;
    }
    return true;
  },
  currentUserChecker: async (action: Action) => {
    const token = action.request.token;
    if (!token) {
      throw new UnauthorizedError('missing token');
    }
    return await tokenUser(token);
  },
  controllers: routes
});

const port = process.env.PORT || 1234;
app.listen(port, () => debug(`Listening on port ${port}`));
