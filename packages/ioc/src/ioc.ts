import "reflect-metadata";

import {
	BindingKey, Constructor,
	IRegistry,
	ModuleDefinition, Provider,
	RegistryState,
	SetupFunction,
	ShutdownFunction,
	isConstructor,
	isValueBinding
  } from '@egc-io/ckit-lib';
  import {container} from "tsyringe";
  
  export class Ioc implements IRegistry {
	private _state: RegistryState = 'unset';
	private setupHooks: SetupFunction[] = [];
	private shutdownHooks: ShutdownFunction[] = [];
  
	constructor(modules: ModuleDefinition[]) {
	  for (const module of modules) {
		if (module?.setup) {
		  this.setupHooks.push(module.setup);
		}
		if (module?.shutdown) {
		  this.shutdownHooks.push(module.shutdown);
		}
		if (module.exports) {
		  module.exports.forEach((provider) => {this.provide(provider);});
		}
	  }
	}
  
	get state(): RegistryState {return this._state;}
  
	provide<T = any>(provider: Provider<T>): void {  
	  if (isConstructor(provider)) {
		container.register(provider, {useClass: provider});
	  } else if (isValueBinding(provider)) {
		if (isConstructor(provider.value)) {
		  container.register(provider.key, {useClass: provider.value});
		} else {
		  container.register(provider.key, {useValue: provider.value});
		}
	  }
	}
  
	bind<T = any>(key: BindingKey, value: T | Constructor<T>): void {
	  if (isConstructor(value)) {
		container.register(key, {useClass: value});
	  } else {
		container.register(key, {useValue: value});
	  }
	}
  
	get<T = any>(key: BindingKey): T {
	  return container.resolve(key) as T;
	}
  
	remove(key: BindingKey): void {
	  throw new Error('Method not implemented.');
	}
  
	flush(): void {
	  throw new Error('Method not implemented.');
	}
  
	async setup(): Promise<void> {
	  this._state = 'loading';
	  for (const hook of this.setupHooks) {
		try {
		  await hook(this);
		} catch (error) {
		  console.log(error);
		  throw new Error('ERR_SETUP_FAILURE : ' + error.message);
		}
	  };
	  this._state = 'ready';
	}
  
	async shutdown(): Promise<void> {
	  this._state = 'unset';
	  for (const hook of this.shutdownHooks) {
		try {
		  await hook(this, 0);
		} catch (error) {
		  throw new Error('ERR_SHUTDOWN_FAILURE : ' + error.message);
		}
	  };
	  container.dispose();
	}
  
  }
  