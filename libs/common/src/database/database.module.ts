import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// MONGOOSE
// import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';

// MYSQL
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Module({
  imports: [
    // MONGOOSE
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     uri: configService.get('MONGODB_URI'),
    //   }),
    //   inject: [ConfigService],
    // }),
    // TYPEORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow('MYSQL_HOST'),
        port: configService.getOrThrow('MYSQL_PORT'),
        database: configService.getOrThrow('MYSQL_DATABASE'),
        username: configService.getOrThrow('MYSQL_USERNAME'),
        password: configService.getOrThrow('MYSQL_PASSWORD'),
        synchronize: configService.getOrThrow('MYSQL_SYNCHRONIZE'),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {
  // MONGOOSE
  // static forFeature(models: ModelDefinition[]) {
  // return MongooseModule.forFeature(models);
  // }

  static forFeature(models: EntityClassOrSchema[]) {
    return TypeOrmModule.forFeature(models);
  }
}
