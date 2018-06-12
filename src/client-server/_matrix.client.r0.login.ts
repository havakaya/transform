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
import { authenticate } from '../auth';
import { normalizeUser } from '../utils';
import { LoginType } from '../types';

@JsonController('')
export class MatrixClientR0Login {
  /**
   * @description : Authenticates the user, and issues an access token they can
   *use to authorize themself in subsequent requests.
   *
   *If the client does not supply a ``device_id``, the server must
   *auto-generate one.
   *
   *The returned access token must be associated with the ``device_id``
   *supplied by the client or generated by the server. The server may
   *invalidate any access token previously associated with that device. See
   *`Relationship between access tokens and devices`_.
   *
   * @parameters : [
   *  {
   *    "in": "body",
   *    "name": "body",
   *    "schema": {
   *      "example": {
   *        "initial_device_display_name": "Jungle Phone",
   *        "password": "ilovebananas",
   *        "type": "m.login.password",
   *        "user": "cheeky_monkey"
   *      },
   *      "properties": {
   *        "address": {
   *          "description": "Third party identifier for the user.",
   *          "type": "string"
   *        },
   *        "device_id": {
   *          "description": "ID of the client device. If this does not correspond to a\nknown client device, a new device will be created. The server\nwill auto-generate a device_id if this is not specified.",
   *          "type": "string"
   *        },
   *        "initial_device_display_name": {
   *          "description": "A display name to assign to the newly-created device. Ignored\nif ``device_id`` corresponds to a known device.",
   *          "type": "string"
   *        },
   *        "medium": {
   *          "description": "When logging in using a third party identifier, the medium of the identifier. Must be 'email'.",
   *          "type": "string"
   *        },
   *        "password": {
   *          "description": "Required when ``type`` is ``m.login.password``. The user's\npassword.",
   *          "type": "string"
   *        },
   *        "token": {
   *          "description": "Required when ``type`` is ``m.login.token``. Part of `Token-based`_ login.",
   *          "type": "string"
   *        },
   *        "type": {
   *          "description": "The login type being used.",
   *          "enum": [
   *            "m.login.password",
   *            "m.login.token"
   *          ],
   *          "type": "string"
   *        },
   *        "user": {
   *          "description": "The fully qualified user ID or just local part of the user ID, to log in.",
   *          "type": "string"
   *        }
   *      },
   *      "required": [
   *        "type"
   *      ],
   *      "type": "object"
   *    }
   *  }
   *]
   *
   * @responses : {
   *  "200": {
   *    "description": "The user has been authenticated.",
   *    "examples": {
   *      "application/json": {
   *        "access_token": "abc123",
   *        "device_id": "GHTYAJCE",
   *        "user_id": "@cheeky_monkey:matrix.org"
   *      }
   *    },
   *    "schema": {
   *      "properties": {
   *        "access_token": {
   *          "description": "An access token for the account.\nThis access token can then be used to authorize other requests.",
   *          "type": "string"
   *        },
   *        "device_id": {
   *          "description": "ID of the logged-in device. Will be the same as the\ncorresponding parameter in the request, if one was specified.",
   *          "type": "string"
   *        },
   *        "home_server": {
   *          "description": "The server_name of the homeserver on which the account has\nbeen registered.\n\n**Deprecated**. Clients should extract the server_name from\n``user_id`` (by splitting at the first colon) if they require\nit. Note also that ``homeserver`` is not spelt this way.",
   *          "type": "string"
   *        },
   *        "user_id": {
   *          "description": "The fully-qualified Matrix ID that has been registered.",
   *          "type": "string"
   *        }
   *      },
   *      "type": "object"
   *    }
   *  },
   *  "400": {
   *    "description": "Part of the request was invalid. For example, the login type may not be recognised.",
   *    "examples": {
   *      "application/json": {
   *        "errcode": "M_UNKNOWN",
   *        "error": "Bad login type."
   *      }
   *    }
   *  },
   *  "403": {
   *    "description": "The login attempt failed. For example, the password may have been incorrect.",
   *    "examples": {
   *      "application/json": {
   *        "errcode": "M_FORBIDDEN"
   *      }
   *    }
   *  },
   *  "429": {
   *    "description": "This request was rate-limited.",
   *    "schema": {
   *      "description": "A Matrix-level Error",
   *      "properties": {
   *        "errcode": {
   *          "description": "An error code.",
   *          "type": "string"
   *        },
   *        "error": {
   *          "description": "A human-readable error message.",
   *          "type": "string"
   *        }
   *      },
   *      "required": [
   *        "errcode"
   *      ],
   *      "type": "object"
   *    }
   *  }
   *}
   *
   * @summary : Authenticates the user.
   *
   */
  @Post('/_matrix/client/r0/login')
  async login(
    @Body({ required: true })
    body: dto.LoginBody
  ): Promise<dto.LoginResponse | dto.LoginResponse429 | any> {
    if (body.type === LoginType.password) {
      const { user, jwt } = await authenticate(
        normalizeUser(body.user!),
        body.password!,
        body.device_id!
      );
      const resp: dto.LoginResponse = {
        access_token: jwt,
        device_id: user.device_id,
        home_server: user.home_server,
        user_id: user.user_id
      };
      return resp;
    }
    throw new HttpError(501);
  }
}
