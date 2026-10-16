import { Fields, Query, QueryWhere, SortDirection, Where, WhereQuery } from "@egc-io/ckit-lib";
import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { IsArray, IsNumber, IsObject, IsOptional, IsString } from "class-validator";

export type QueryObject<T extends object> = Query<T>;

export class QueryDTO<T extends object> implements QueryWhere<T> {
	@IsOptional()
	@IsArray()
	fields?: Fields<T>;

	@IsOptional()
	@IsObject()
	relations?: Record<string, boolean>;

	@IsOptional()
	@IsObject()
	sort?: Partial<Record<keyof T, SortDirection>>;

	@IsOptional()
	@IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
	limit?: number;

	@IsOptional()
	@IsNumber()
	offset?: number;

	@IsOptional()
	where?: Where<T> | Where<T>[];

	[props: string]: unknown;
}

export class QueryPipe<T extends object> implements PipeTransform<Record<string, string>, QueryDTO<T>> {
	transform(value: Record<string, string>, metadata: ArgumentMetadata): QueryDTO<T> {
		let parse: QueryObject<T> = {};
		for (const k in value) {
			switch (k) {
				case 'limit':
				case 'offset': {
					const num = value[k] ? Number(value[k]) : undefined;
					if (num) {
						if (Number.isNaN(num)) {
							throw new BadRequestException(`${k} is not a number`);
						}
						if (!Number.isInteger(num)) {
							throw new BadRequestException(`${k} must be integer`);
						}
					}
					parse[k] = num;
				}
				case 'sort': {
					parse[k] = value[k] ? JSON.parse(value[k]) : undefined;
					break;
				}
				default: {
					parse[k] = value[k] ? String(value[k]) : undefined;
					break;
				}
			}
		}
		return parse;
	}
}