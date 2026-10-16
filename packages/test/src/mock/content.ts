import { randomInt } from 'node:crypto';
import sharp = require('sharp');
import { words } from '../words';
import { Content, description } from '../common';

export type ImgFormat = {
	width: number,
	height: number,
	tag: string;
};

export type Color = { r: number, g: number, b: number; };

export type Img = {
	format: ImgFormat;
	description: string;
} & Content;

export async function randomImg(format: ImgFormat, color?: Color) {
	const background: Color = color ?? { r: randomInt(0, 255), g: randomInt(0, 255), b: randomInt(0, 255) };
	const img = await sharp({
		create: {
			width: format.width,
			height: format.height,
			channels: 3,
			background
		}
	}).png().toBuffer();
	return img;
}

const FormatList: ImgFormat[] = [
	{ width: 24, height: 24, tag: 'ico_S' },
	{ width: 32, height: 32, tag: 'ico_M' },
	{ width: 64, height: 64, tag: 'ico_L' },
	{ width: 48, height: 48, tag: 'avt_S' },
	{ width: 96, height: 96, tag: 'avt_M' },
	{ width: 96, height: 96, tag: 'thumb_S' },
	{ width: 320, height: 192, tag: 'thumb_mobile' },
	{ width: 400, height: 248, tag: 'thumb_desktop' },
	{ width: 728, height: 96, tag: 'banner_S_desktop' },
	{ width: 960, height: 248, tag: 'banner_M_desktop' },
	{ width: 1200, height: 624, tag: 'banner_L_desktop' },
	{ width: 320, height: 96, tag: 'banner_mobile' },
];

export async function getImgContentList(count: number): Promise<Img[]> {
	const imgList: Img[] = [];
	for (let index = 0; index < count; index++) {
		const name = words(randomInt(2, 4)).join('-');
		const color = { r: randomInt(0, 255), g: randomInt(0, 255), b: randomInt(0, 255) };
		for (const format of FormatList) {
			const fileName = `${name}_${format.tag}_${format.width}x${format.height}.png`;
			imgList.push({
				fileName,
				description: description(fileName, format.tag),
				tag: format.tag,
				format,
				data: await randomImg(format, color),
			});
		}
	}
	return imgList;
}