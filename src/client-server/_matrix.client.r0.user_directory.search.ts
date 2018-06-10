
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
export class MatrixClientR0UserDirectorySearch {
@Post("/_matrix/client/r0/user_directory/search")
async searchUserDirectory(@Body({ required: true }) body: dto.SearchUserDirectoryBody) : Promise< dto.SearchUserDirectoryResponse|dto.SearchUserDirectoryResponse429|any > {
 throw new HttpError(501);
}

}
