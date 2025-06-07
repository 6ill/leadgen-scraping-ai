import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
                type: 'postgres',
                host: 'localhost',
                port: configService.get('POSTGRES_PORT'),
                password: configService.get('POSTGRES_PASSWORD'),
                username: configService.get('POSTGRES_USER'),
                database: configService.get('POSTGRES_DB'),
                synchronize: true,
                autoLoadEntities: true,
            })
        })
    ]
})
export class DatabaseModule {}
