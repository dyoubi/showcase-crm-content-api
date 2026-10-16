import { FileEntity, FileSearchQuery } from "@ringcontent/core";
import { Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { QueryDTO, QueryPipe } from "src/common/query";

export class FileSearchQueryDTO extends QueryDTO<FileEntity> implements FileSearchQuery {
	@ApiProperty()
	@IsString()
	match: string;

	[props: string]: unknown;
}

@Injectable()
export class SearchQueryPipe extends QueryPipe<FileEntity> {
	transform(value: Record<string, string>, metadata: ArgumentMetadata): FileSearchQueryDTO {
		if (!value.match) {
			throw new BadRequestException(`missing match pattern`);
		}
		return {
			...super.transform(value, metadata),
			match: value.match,
		};
	}
}

export class FileDeleteQueryDTO {
	@ApiProperty()
	id: string | string[];
}