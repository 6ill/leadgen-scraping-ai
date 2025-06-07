import { Body, Controller, Get, ParseArrayPipe,  ParseUUIDPipe,  Post} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { SearchQueryDTO } from './dtos';

@Controller('leads')
export class LeadsController {
  constructor(
    private readonly leadsService: LeadsService,
  ) {}

  @Get()
  async getLeads() {
    const data = await this.leadsService.getLeads();
    return { data };
  }

  @Post('search')
  async searchLeads(@Body() searchQueryDTO:SearchQueryDTO) {
    const data = await this.leadsService.searchLeads(searchQueryDTO);
    return { data }
  }

  @Post('enrich')
  async enrichLeads(@Body('domains', new ParseArrayPipe({ items: String })) domains: string[]) {
    await this.leadsService.enrichLeads(domains);
    return {
      status: 'success'
    }
  }

  @Post('evaluate') 
  async evaluateLeads(@Body('ids', new ParseArrayPipe({ items: ParseUUIDPipe })) leadIds: string[]) {
    await this.leadsService.evaluateLeads(leadIds);
    return {
      status: 'success'
    }
  }  
}
