import axios, { type AxiosResponse } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const searchLeads = async (industry: string, location: string) => {
    await axios.post(`${API_BASE_URL}/leads/search`, {
        industry,
        location,
    });  
};

export const enrichLeads = async (domains: string[]) => {
    await axios.post(`${API_BASE_URL}/leads/enrich`, { domains });
};

export const evaluateLeads = async (leadIds: string[]) => {
    await axios.post(`${API_BASE_URL}/leads/evaluate`, { ids: leadIds });
};

export const exportData = async():Promise<AxiosResponse> => {
    const response = await axios.post(`${API_BASE_URL}/leads/export`, {}, {
        responseType: 'blob'
    })

    return response;   
}

export const getLeads = async () => {
    const response = await axios.get(`${API_BASE_URL}/leads`);
    return response.data.data;
};
export interface Lead {
    id: string;
    description?: string;
    companyName: string;
    industry?: string;
    location?: string;
    domain: string;
    numEmployees?: number;
    contactPhone?: string;
    linkedinUrl?: string;
    websiteUrl: string;
    icpScore?: number;
    keywordScore?: number;
    priorityScore?: number;
    keywords?: string[];
    outreachAngle?: string;
    createdAt: Date;
    updatedAt: Date;
}
