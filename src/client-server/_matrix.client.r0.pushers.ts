
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
  
  import * as dto from './dto';  
  
@JsonController("")
export class MatrixClientR0Pushers {
@Get("/_matrix/client/r0/pushers")
async getPushers() : Promise< dto.GetPushersResponse|any > {
 throw new HttpError(501);
}

}
