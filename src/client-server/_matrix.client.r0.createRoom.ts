import {
  JsonController,
  Authorized,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  HttpError,
  NotFoundError,
  BadRequestError,
  CurrentUser,
  QueryParam,
  HeaderParam,
  UnauthorizedError
} from 'routing-controllers';

import { User } from '../model';
import * as dto from './types';
import { ErrorTypes } from '../types';
import { normalizeRoom, normalizeAlias, rand } from '../utils';
import { StateEventType, CreateRoomEvent, MemberEvent } from './events';
import { redisEnque, redisAsync, RedisKeys } from '../redis';
import { handleCreateRoom } from '../createRoomHandler';
import { handleMember } from '../memberHandler';
import { processEvent } from '../roomevents';

const debug = require('debug')('server:createRoom');

@JsonController('')
export class MatrixClientR0CreateRoom {
  @Post('/_matrix/client/r0/createRoom')
  async createRoom(
    @CurrentUser() user: User,
    @Body() body: dto.CreateRoomBody
  ): Promise<dto.CreateRoomResponse> {
    // TODO - check if room can be created
    // by user:power
    // by config

    // Room can be identified uniquely by alias, if supplied
    const alias = body.room_alias_name
      ? normalizeAlias(body.room_alias_name)
      : null;
    const room_id = normalizeRoom(rand());

    if (alias) {
      // check and set room:alias -> id
      // otherwise we can have a race condition where multiple users try and create same room
      const roomKey = RedisKeys.ROOM_ALIAS + alias;
      const canSet = await redisAsync().setAsync(roomKey, [room_id, 'NX']);
      debug('set', roomKey, canSet);
      if (!canSet) {
        throw new BadRequestError(ErrorTypes.M_ROOM_IN_USE);
      }
    }

    // save body
    await redisAsync().setAsync(RedisKeys.ROOM_PENDING + room_id, [
      JSON.stringify(body)
    ]);

    const ts = Date.now();
    // m.room.create event
    // visibility & isDirect cannot be accomodated in events TODO - file bug
    const createEvent: CreateRoomEvent = {
      content: { creator: user.user_id, 'm.federate': true },
      type: StateEventType.create,
      event_id: rand(),
      room_id,
      sender: user.user_id,
      origin_server_ts: ts,
      state_key: ''
    };

    await processEvent(createEvent);

    const joinEvent: MemberEvent = {
      content: { membership: 'join' },
      type: StateEventType.member,
      event_id: rand(),
      state_key: room_id,
      room_id,
      sender: user.user_id,
      origin_server_ts: Date.now()
    };
    await processEvent(joinEvent);

    // queue to room
    // TODO events
    // m.room.power_levels
    // presets
    // initial_state
    // name, topic
    // invite, invite3Pid
    // alias?

    const events: string[] = [];
    // add state event
    events.push(`${StateEventType.create}`, JSON.stringify(createEvent));
    // add join event
    events.push(`${StateEventType.member}`, JSON.stringify(joinEvent));

    const stateQ = RedisKeys.STATE_EVENTS + room_id;
    const q = await redisEnque(stateQ, events);
    debug(`${stateQ}: queued: ${q} ${events.length}`);

    // TODO - M_INVALID_ROOM_STATE:
    return { room_id };
  }
}
