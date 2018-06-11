
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
  
@JsonController("")
export class MatrixClientR0RoomsRoomIdJoinedMembers {
@Get("/_matrix/client/r0/rooms/{roomId}/joined_members")
async getJoinedMembersByRoom(@Param("roomId") roomId:string) : Promise< dto.GetJoinedMembersByRoomResponse|any > {
 throw new HttpError(501);
}

}

