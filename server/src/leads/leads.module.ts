import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from 'src/database/entity';
import { HttpModule } from '@nestjs/axios';
import { LlmService, ApolloService, ScraperService } from './tools';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';


@Module({
  imports:[
    TypeOrmModule.forFeature([Lead]),
    HttpModule.register({})
  ],
  controllers: [LeadsController],
  providers: [
    LeadsService, 
    LlmService,
    {
      provide: 'GEMINI',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => (
        new GoogleGenerativeAI(configService.get('GEMINI_API_KEY')).getGenerativeModel({
          model: 'gemini-2.0-flash',
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        }) 
      )
    },
    ApolloService,
    ScraperService
  ],
})
export class LeadsModule {}
