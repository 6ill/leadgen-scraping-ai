import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'leads'})
export class Lead {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    title?: string; 

    @Column({ name: 'source_url', nullable: true, type: 'text' })
    sourceUrl?: string; 

    @Column({ type: 'text', nullable: true })
    summary?: string; // AI-generated summary

    @Column({ name: 'signal_type', nullable: true })
    signalType?: string; // e.g., "Funding", "Expansion", "New Product"

    @Column({ name: 'company_name', nullable: true })
    companyName?: string;

    @Column({ nullable: true })
    industry?: string;

    @Column({ nullable: true })
    location?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}