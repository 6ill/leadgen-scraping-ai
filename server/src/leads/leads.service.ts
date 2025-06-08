import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CompanyDTO, SearchQueryDTO } from './dtos';
import { ApolloService, LlmService, ScraperService } from './tools';
import { InjectRepository } from '@nestjs/typeorm';
import { Lead } from 'src/database/entity';
import { In, Repository } from 'typeorm';
import * as xlsx from 'xlsx';

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
        return this.leadsRepo.find({
            order: {
                updatedAt: 'DESC',
            }
        });
    }

    async searchLeads(searchQueryDTO:SearchQueryDTO): Promise<void> {
        const searchResults = await this.scraperService.scrapeYellowPages(searchQueryDTO);
        
        const uniqueLeadsMap = new Map<string, CompanyDTO>();
        // Deduplicate the scraped entries
        searchResults.forEach(lead => {
            uniqueLeadsMap.set(lead.domain, lead);
        });

        // Convert the Map values back to an array
        const leadsToUpsert = Array.from(uniqueLeadsMap.values());
        await this.leadsRepo.upsert(
            leadsToUpsert,
            {
                conflictPaths: ['domain'],
                skipUpdateIfNoValuesChanged: true,
                upsertType: 'on-conflict-do-update'
            }
        );
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

    async exportToExcel(): Promise<any> {
        const leads = await this.getLeads();
        const convertedLeads = leads.map(lead => {
            return {
                ...lead,
                keywords: lead.keywords?.join(', ')
            }
        })
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(leads);
        xlsx.utils.book_append_sheet(workbook, worksheet);
        const buffer = xlsx.write(workbook, {type: 'buffer', bookType:'xlsx'});
        return buffer;
    }

    private calculatePriorityScore(icpScore: number, keywordScore: number): number {
        return (icpScore * 0.6) + (keywordScore * 20 * 0.4);
    }
}
