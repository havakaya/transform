
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
export class MatrixClientR0UserUserIdFilterFilterId {
@Get("/_matrix/client/r0/user/{userId}/filter/{filterId}")
async getFilter(@Param("userId") userId:string,@Param("filterId") filterId:string) : Promise< dto.GetFilterResponse|any > {
 throw new HttpError(501);
}

}
