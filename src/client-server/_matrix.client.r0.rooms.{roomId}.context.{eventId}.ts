
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
export class MatrixClientR0RoomsRoomIdContextEventId {
@Get("/_matrix/client/r0/rooms/{roomId}/context/{eventId}")
async getEventContext(@Param("roomId") roomId:string,@Param("eventId") eventId:string,@QueryParam("limit",{ required: true }) limit:number) : Promise< dto.GetEventContextResponse|any > {
 throw new HttpError(501);
}

}
