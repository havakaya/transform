
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
export class MatrixClientR0Search {
@Post("/_matrix/client/r0/search")
async search(@QueryParam("next_batch",{ required: true }) nextBatch:string,@Body({ required: true }) body: dto.SearchBody) : Promise< dto.ResultsResponse|dto.SearchResponse429|any > {
 throw new HttpError(501);
}

}
