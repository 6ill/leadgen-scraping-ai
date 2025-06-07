import { GenerativeModel } from '@google/generative-ai';
import { Inject, Injectable } from '@nestjs/common';
import { Lead } from 'src/database/entity';
import { EvaluationDTO } from '../dtos/evaluation.dto';

@Injectable()
export class LlmService {
    constructor(
        @Inject('GEMINI')
        private readonly geminiModel: GenerativeModel,
    ) {}

    async evaluateLeads(leads: Lead[]): Promise<EvaluationDTO[]> {
        const prompt = this.createPrompt(leads)
        return await this.evaluateCompaniesBatch(prompt)       
    }

    private createPrompt(leads: Lead[]): string {
        return `Analyze these companies for B2B lead qualification. 
        For each company, return output structured JSON with:
        - id: company id (text)
        - icpScore: ICP score consider industry, description, number employees, etc (integer range 0-100) 
        - keywordScore: 1-5 relevance (integer)
        - outreachAngle: personalized suggestion to outreach potential lead (text < 200 words)
        Return a JSON array of results in the same order as the companies listed.

        Companies:
        ${leads.map((lead, index) => `
        ${index + 1}. ${lead.companyName}
        Company ID: ${lead.id}
        Website: ${lead.websiteUrl}
        Industry: ${lead.industry || 'N/A'}
        Location: ${lead.location || 'N/A'}
        Description: ${lead.description}
        Num Employees: ${lead.numEmployees}
        Keywords: ${lead.keywords?.join(', ') || 'N/A'}
        `).join('\n')}`;
    }

    async evaluateCompaniesBatch(prompt: string): Promise<EvaluationDTO[]>{
        const result = await this.geminiModel.generateContent(prompt);
        const responseText = result.response.text();
        console.log("prompt result: ", responseText);
        return JSON.parse(responseText);
    }

}
