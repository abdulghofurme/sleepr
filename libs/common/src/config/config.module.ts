import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule as NestConfigModule } from '@nestjs/config';
import { configSchema } from './config.validation';

@Module({
	imports: [NestConfigModule.forRoot({
		validate: (config) => {
			const parsed = configSchema.safeParse(config);
			if (!parsed.success) {
				console.log('Config validation error:', parsed.error.format())
				throw new Error('Invalid configuration')
			}

			return parsed.data
		}
	})],
	providers: [ConfigService],
	exports: [ConfigService],
})
export class ConfigModule { }
