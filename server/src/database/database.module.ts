import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('HOST'),
                port: parseInt(configService.get('POSTGRES_PORT')) || 5432,
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
