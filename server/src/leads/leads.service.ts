import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SearchQueryDTO } from './dtos';
import { ApolloService, LlmService, ScraperService } from './tools';
import { InjectRepository } from '@nestjs/typeorm';
import { Lead } from 'src/database/entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class LeadsService {
    constructor(
        @InjectRepository(Lead)
        private readonly leadsRepo: Repository<Lead>,
        private readonly scraperService: ScraperService,
        private readonly apolloService: ApolloService,
        private readonly llmService: LlmService
    ){}

    async getLeads(): Promise<Lead[]> {
        return this.leadsRepo.find();
    }

    async searchLeads(searchQueryDTO:SearchQueryDTO): Promise<Lead[]> {
        const searchResults = await this.scraperService.scrapeYellowPages(searchQueryDTO);

        const companies = await this.leadsRepo.save(searchResults);

        return companies
    }

    async enrichLeads(domains: string[]){
        const results = await this.apolloService.enrichLeads(domains);
        const updatePromises = results.map(async (company) => {
            await this.leadsRepo.update({domain: company.domain}, company);
        })
    
        await Promise.allSettled(updatePromises);
    }

    async evaluateLeads(leadIds: string[]) {
        try {
            const leads = await this.leadsRepo.find({
                where: {id: In(leadIds)}
            })

            const evaluationResult = await this.llmService.evaluateLeads(leads);
            console.log(evaluationResult);
            const evaluationWithPriortyScore = evaluationResult.map(evaluation => ({
                    ...evaluation,
                    priorityScore: this.calculatePriorityScore(evaluation.icpScore, evaluation.keywordScore),
            }))

            await this.leadsRepo.save(evaluationWithPriortyScore)
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    private calculatePriorityScore(icpScore: number, keywordScore: number): number {
        return (icpScore * 0.6) + (keywordScore * 20 * 0.4);
    }
}
