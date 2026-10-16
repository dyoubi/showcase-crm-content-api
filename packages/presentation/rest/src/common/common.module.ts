import { DynamicModule, Global, Module } from '@nestjs/common';
import { IocProvider } from './ioc';

@Global()
@Module({})
export class CommonModule {
	static async forRoot(): Promise<DynamicModule> {
		return {
			module: CommonModule,
			providers: [IocProvider],
			exports: [IocProvider]
		};
	}
}
