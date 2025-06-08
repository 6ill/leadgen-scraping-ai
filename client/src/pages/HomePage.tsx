import React, { useState, useEffect } from "react";
import {
    Container,
    Grid,
    Typography,
} from "@mui/material";
import SearchForm from "../components/SearchForm";
import { getLeads } from "../api/lead";
import LeadsTable from "../components/LeadsTable";
import ExportButton from "../components/ExportButton";

const HomePage: React.FC = () => {
    const [leads, setLeads] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    const fetchInitialLeads = async () => {
        try {
            const data = await getLeads();
            setLeads(data);
        } catch (error) {
            console.error("Failed to fetch leads:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialLeads();
    }, []);

    const handleSearchResults = async () => {
        await fetchInitialLeads()
    };

    const handleRefetch = async () => {
        setIsLoading(true);
        try {
            const data = await getLeads();
            setLeads(data);
        } catch (error) {
            console.error("Failed to refetch leads:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
                B2B Lead Generator
            </Typography>

            <SearchForm
                onSearch={handleSearchResults}
                isLoading={isSearching}
                setIsLoading={setIsSearching}
            />

            <Grid container justifyContent="flex-end" sx={{ mb: 2 }}>
                <Grid>
                    <ExportButton disabled={isLoading || leads.length === 0} />
                </Grid>
            </Grid>

            <LeadsTable
                leads={leads}
                isLoading={isLoading || isSearching}
                onRefetch={handleRefetch}
            />
        </Container>
    );
};

export default HomePage;
