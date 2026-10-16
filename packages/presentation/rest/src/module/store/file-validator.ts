import { Mimetype, SizeLimit } from "@ringcontent/core";
import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { cp } from "fs";

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
	transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
		return !!SizeLimit(value.size, 16);
	}
}

@Injectable()
export class FileMimeTypeValidationPipe implements PipeTransform {
	transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
		return !!Mimetype.includes(value.mimetype);
	}
}