import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ProviderOptionsSymbol, TypeOptions } from './provider.constants'
import { BaseOAuthService } from './services/base-oauth.service'

@Injectable()
export class ProviderService implements OnModuleInit {
	public constructor(
		@Inject(ProviderOptionsSymbol) private readonly options: TypeOptions
	) {}

	public onModuleInit(): any {
		for (const provider of this.options.services) {
			provider.baseUrl = this.options.baseUrl
		}
	}

	public findByService(serviceName: string): BaseOAuthService | null {
		return this.options.services.find(s => s.name === serviceName)
	}
}