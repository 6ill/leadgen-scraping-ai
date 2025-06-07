import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'leads'})
export class Lead {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: true })
    description?: string; 

    @Column({ name: 'company_name'})
    companyName: string;

    @Column({ nullable: true })
    industry?: string;

    @Column({ nullable: true })
    location?: string;

    @Column({ unique:true })
    domain: string;

    @Column({ name: 'num_employees', type:'int', nullable: true})
    numEmployees?: number;
    
    @Column({ name: 'contact_phone', nullable: true })
    contactPhone?: string;

    @Column({ name: 'linkedin_url', nullable: true })
    linkedinUrl?: string;

    @Column({ nullable:true })
    websiteUrl: string;

    // AI enrichment fields
    @Column({ name: 'icp_score', type: 'int8', nullable: true})
    icpScore?: number;  // 0-100 ICP match 

    @Column({ name: 'keyword_score', type: 'int4', nullable: true })
    keywordScore?: number;  // 1-5 relevance score

    @Column({ name: 'priority_score', type: 'float', nullable: true })
    priorityScore?: number;  // Calculated priority score

    @Column({ type: 'simple-array', nullable: true })
    keywords?: string[];

    @Column({ name: 'outreach_angle', type: 'text', nullable: true })
    outreachAngle?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}