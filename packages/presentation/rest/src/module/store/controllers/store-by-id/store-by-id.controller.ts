import {

    SearchFileUseCase, SearchFileCountUseCase
} from '@ringcontent/application';
import { Ioc } from '@ringcontent/ioc';
import {
    BadRequestException,
    Controller, Get, Inject, Param,
    Query
} from '@nestjs/common';
import { UUID } from 'crypto';
import { IOC } from 'src/common/ioc';
import { FileSearchQueryDTO, SearchQueryPipe } from '../../dto';
import { ApiTags } from '@nestjs/swagger';
import { Exception } from '@egc-io/ckit-lib';

@ApiTags('Store', 'Stores')
@Controller('stores/:store_id')
export class StoreByIdController {
    constructor(@Inject(IOC) private _ioc: Ioc,) { }
    @Get('search')
    async searchFiles(
        @Param('store_id') store_id: UUID,
        @Query(SearchQueryPipe) query: FileSearchQueryDTO
    ) {
        console.log(query);
        if (query.match.length < 2) { return []; }
        const use = this._ioc.get<SearchFileUseCase>(SearchFileUseCase);
        try {
            const fileList = await use.execute({ query, store_id });
            return fileList;
        } catch (error) {
            if (error instanceof Exception) {
                throw error;
            } else {
                throw new BadRequestException(`${error.message}`);
            }
        }
    }

    @Get('search/count')
    async searchCount(
        @Param('store_id') store_id: UUID,
        @Query(SearchQueryPipe) query: FileSearchQueryDTO
    ) {
        const use = this._ioc.get<SearchFileCountUseCase>(SearchFileCountUseCase);
        try {
            const count = await use.execute({ query, store_id });
            return count;
        } catch (error) {
            throw new BadRequestException(`${error.message}`);
        }
    }

}
