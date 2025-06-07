import { IsNotEmpty, IsOptional } from "class-validator";

export class SearchQueryDTO {
    @IsNotEmpty()
    industry: string;
    
    @IsNotEmpty()
    location: string;
}