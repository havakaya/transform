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

import * as dto from './types';
import { User } from '../model';

@JsonController('')
export class MatrixClientR0Events {
  /**
   * @deprecated : true
   *
   * @description : This will listen for new events and return them to the caller. This will
   *block until an event is received, or until the ``timeout`` is reached.
   *
   *This endpoint was deprecated in r0 of this specification. Clients
   *should instead call the |/sync|_ API with a ``since`` parameter. See
   *the `migration guide
   *<https://matrix.org/docs/guides/client-server-migrating-from-v1.html#deprecated-endpoints>`_.
   *
   * @parameters : [
   *  {
   *    "description": "The token to stream from. This token is either from a previous\nrequest to this API or from the initial sync API.",
   *    "in": "query",
   *    "name": "from",
   *    "required": false,
   *    "type": "string",
   *    "x-example": "s3456_9_0"
   *  },
   *  {
   *    "description": "The maximum time in milliseconds to wait for an event.",
   *    "in": "query",
   *    "name": "timeout",
   *    "required": false,
   *    "type": "integer",
   *    "x-example": "35000"
   *  }
   *]
   *
   * @responses : {
   *  "200": {
   *    "description": "The events received, which may be none.",
   *    "examples": {
   *      "application/json": {
   *        "chunk": [
   *          {
   *            "age": 32,
   *            "content": {
   *              "body": "incoming message",
   *              "msgtype": "m.text"
   *            },
   *            "event_id": "$14328055551tzaee:localhost",
   *            "origin_server_ts": 1432804485886,
   *            "room_id": "!TmaZBKYIFrIPVGoUYp:localhost",
   *            "sender": "@bob:localhost",
   *            "type": "m.room.message"
   *          }
   *        ],
   *        "end": "s3457_9_0",
   *        "start": "s3456_9_0"
   *      }
   *    },
   *    "schema": {
   *      "properties": {
   *        "chunk": {
   *          "description": "An array of events.",
   *          "items": {
   *            "allOf": [
   *              {
   *                "allOf": [
   *                  {
   *                    "description": "The basic set of fields all events must have.",
   *                    "properties": {
   *                      "content": {
   *                        "description": "The fields in this object will vary depending on the type of event. When interacting with the REST API, this is the HTTP body.",
   *                        "type": "object"
   *                      },
   *                      "type": {
   *                        "description": "The type of event. This SHOULD be namespaced similar to Java package naming conventions e.g. 'com.example.subdomain.event.type'",
   *                        "type": "string"
   *                      }
   *                    },
   *                    "required": [
   *                      "type"
   *                    ],
   *                    "title": "Event",
   *                    "type": "object"
   *                  }
   *                ],
   *                "description": "In addition to the Event fields, Room Events have the following additional fields.",
   *                "properties": {
   *                  "event_id": {
   *                    "description": "The globally unique event identifier.",
   *                    "type": "string"
   *                  },
   *                  "origin_server_ts": {
   *                    "description": "Timestamp in milliseconds on originating homeserver when this event was sent.",
   *                    "type": "number"
   *                  },
   *                  "room_id": {
   *                    "description": "The ID of the room associated with this event.",
   *                    "type": "string"
   *                  },
   *                  "sender": {
   *                    "description": "Contains the fully-qualified ID of the user who *sent* this event.",
   *                    "type": "string"
   *                  },
   *                  "unsigned": {
   *                    "description": "Contains optional extra information about the event.",
   *                    "properties": {
   *                      "age": {
   *                        "description": "The time in milliseconds that has elapsed since the event was sent. This field is generated by the local homeserver, and may be incorrect if the local time on at least one of the two servers is out of sync, which can cause the age to either be negative or greater than it actually is.",
   *                        "type": "integer"
   *                      },
   *                      "redacted_because": {
   *                        "description": "Optional. The event that redacted this event, if any.",
   *                        "title": "Event",
   *                        "type": "object"
   *                      },
   *                      "transaction_id": {
   *                        "description": "The client-supplied transaction ID, if the client being given the event is the same one which sent it.",
   *                        "type": "string"
   *                      }
   *                    },
   *                    "title": "UnsignedData",
   *                    "type": "object"
   *                  }
   *                },
   *                "required": [
   *                  "event_id",
   *                  "room_id",
   *                  "sender",
   *                  "origin_server_ts"
   *                ],
   *                "title": "Room Event",
   *                "type": "object"
   *              }
   *            ],
   *            "title": "Event",
   *            "type": "object"
   *          },
   *          "type": "array"
   *        },
   *        "end": {
   *          "description": "A token which correlates to the last value in ``chunk``. This\ntoken should be used in the next request to ``/events``.",
   *          "type": "string"
   *        },
   *        "start": {
   *          "description": "A token which correlates to the first value in ``chunk``. This\nis usually the same token supplied to ``from=``.",
   *          "type": "string"
   *        }
   *      },
   *      "type": "object"
   *    }
   *  },
   *  "400": {
   *    "description": "Bad pagination ``from`` parameter."
   *  }
   *}
   *
   * @security : [
   *  {
   *    "accessToken": []
   *  }
   *]
   *
   * @summary : Listen on the event stream.
   *
   */
  @Get('/_matrix/client/r0/events')
  async getEvents(
    @QueryParam('from') from: string,
    @QueryParam('timeout') timeout: number,
    @CurrentUser() user?: User
  ): Promise<dto.GetEventsResponse | any> {
    throw new HttpError(501);
  }
}
