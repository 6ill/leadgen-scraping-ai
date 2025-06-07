import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApolloCompanytDTO } from '../dtos';
import { AxiosError } from 'axios';
import { getDomain } from '../helper';

@Injectable()
export class ApolloService {
    private readonly logger = new Logger(ApolloService.name);
    private readonly apiURL = 'https://api.apollo.io/api/v1/';

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService
    ) {}

    async enrichLeads(domains: string[]): Promise<ApolloCompanytDTO[]> {
        const apiKey = this.configService.get<string>('APOLLO_API_KEY');
        if (!apiKey || apiKey === '') {
            throw new Error('Apollo API key not configured');
        }
        const domainsQuery = domains.map(domain => 'domains[]=' + domain).join('&')
        try {
            const response = await this.httpService.axiosRef.post(
                `${this.apiURL}/organizations/bulk_enrich?${domainsQuery}`, null,
                {
                    headers: { 
                        'x-api-key': apiKey,
                    }
                }
            )
            

            if (response.data.error_code) {
                throw new InternalServerErrorException(response.data.error_message);
            }
            const results: ApolloCompanytDTO[] = [];

            response.data.organizations.forEach(org => {
                if(!org) return 
                results.push({
                    domain: getDomain(org.website_url),
                    contactPhone: org.phone,
                    keywords: org.keywords,
                    linkedinUrl: org.linkedin_url,
                    industry: org.industry,
                    description: org.short_description,
                    numEmployees: org.estimated_num_employees
                });
            });
            console.log(results);
            return results;
        } catch (error) {
            this.handleApolloError(error);
            return []; 
        }
    }

    private handleApolloError(error: any): void {
        if (error instanceof AxiosError) {
            this.logger.error(
                `Apollo API error: ${error.response?.status} - ${error.response?.data?.error || error.message}`
            );
            throw new Error(
                `Contact search failed: ${error.response?.data?.error || 'API error'}`
            );
        }
        this.logger.error(`Apollo search failed: ${error.message}`);
        throw new Error('Contact search service unavailable');
    }
}
