import React, { useState } from "react";
import {
    Autocomplete,
    TextField,
    Button,
    Grid,
    Box,
    CircularProgress,
} from "@mui/material";
import { INDUSTRIES, LOCATIONS } from "../constants";
import { searchLeads } from "../api/lead";

interface SearchFormProps {
    onSearch: () => Promise<void>;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
    onSearch,
    isLoading,
    setIsLoading,
}) => {
    const [industry, setIndustry] = useState<string>(INDUSTRIES[0]);
    const [location, setLocation] = useState<string>(LOCATIONS[0]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await searchLeads(industry, location);
            await onSearch();
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs:12, md:5 }}>
                    <Autocomplete
                        options={INDUSTRIES}
                        value={industry}
                        onChange={(_, newValue) =>
                            setIndustry(newValue || INDUSTRIES[0])
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Industry"
                                required
                                fullWidth
                            />
                        )}
                        disableClearable
                    />
                </Grid>
                <Grid size={{ xs:12, md:5 }}>
                    <Autocomplete
                        options={LOCATIONS}
                        value={location}
                        onChange={(_, newValue) =>
                            setLocation(newValue || LOCATIONS[0])
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Location"
                                required
                                fullWidth
                            />
                        )}
                        disableClearable
                    />
                </Grid>
                <Grid size={{ xs:12, md:2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={isLoading}
                        sx={{ height: "56px" }}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} />
                        ) : (
                            "Find Leads"
                        )}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SearchForm;
