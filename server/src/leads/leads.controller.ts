import { Body, Controller, Get, Header, ParseArrayPipe,  ParseUUIDPipe,  Post, StreamableFile} from '@nestjs/common';
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
    await this.leadsService.searchLeads(searchQueryDTO);
    return {
      status: 'success'
    }
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

  @Post('export')
  @Header('Content-Disposition', 'attachment; filename="leads.excel"')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  async exportToExcel(){
    const buffer = await this.leadsService.exportToExcel();
    return new StreamableFile(buffer);
  }
}
