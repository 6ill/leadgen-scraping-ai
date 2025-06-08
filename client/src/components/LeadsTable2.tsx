import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Button,
    Box,
    CircularProgress,
} from "@mui/material";
import { enrichLeads, evaluateLeads, type Lead } from "../api/lead";

interface LeadsTableProps {
    leads: Lead[];
    isLoading: boolean;
    onRefetch: () => void;
}

const LeadsTable: React.FC<LeadsTableProps> = ({
    leads,
    isLoading,
    onRefetch,
}) => {
    const [selected, setSelected] = useState<string[]>([]);
    const [isEnriching, setIsEnriching] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelected(e.target.checked ? leads.map((lead) => lead.id) : []);
    };

    const handleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const handleEnrich = async () => {
        if (!selected.length) return;

        setIsEnriching(true);
        try {
            const domains = leads
                .filter((lead) => selected.includes(lead.id))
                .map((lead) => lead.domain);

            await enrichLeads(domains);
            onRefetch();
        } catch (error) {
            console.error("Enrichment failed:", error);
        } finally {
            setIsEnriching(false);
        }
    };

    const handleEvaluate = async () => {
        if (!selected.length) return;

        setIsEvaluating(true);
        try {
            await evaluateLeads(selected);
            onRefetch();
        } catch (error) {
            console.error("Evaluation failed:", error);
        } finally {
            setIsEvaluating(false);
        }
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Box sx={{ p: 2, display: "flex", gap: 2 }}>
                <Button
                    variant="outlined"
                    onClick={handleEnrich}
                    disabled={isEnriching || !selected.length}
                >
                    {isEnriching ? (
                        <CircularProgress size={24} />
                    ) : (
                        "Enrich"
                    )}
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleEvaluate}
                    disabled={isEvaluating || !selected.length}
                >
                    {isEvaluating ? (
                        <CircularProgress size={24} />
                    ) : (
                        "Evaluate"
                    )}
                </Button>
            </Box>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={
                                    selected.length > 0 &&
                                    selected.length < leads.length
                                }
                                checked={
                                    selected.length === leads.length &&
                                    leads.length > 0
                                }
                                onChange={handleSelectAll}
                            />
                        </TableCell>
                        <TableCell>Company</TableCell>
                        <TableCell>Industry</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Website</TableCell>
                        <TableCell>Contact Phone</TableCell>
                        <TableCell align="right">ICP Score</TableCell>
                        <TableCell align="right">Priority</TableCell>
                        <TableCell>Outreach Angle</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                <CircularProgress />
                            </TableCell>
                        </TableRow>
                    ) : leads.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                No leads found. Try a different search.
                            </TableCell>
                        </TableRow>
                    ) : (
                        leads.map((lead) => (
                            <TableRow key={lead.id}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selected.includes(lead.id)}
                                        onChange={() => handleSelect(lead.id)}
                                    />
                                </TableCell>
                                <TableCell>{lead.companyName}</TableCell>
                                <TableCell>{lead.industry}</TableCell>
                                <TableCell>{lead.location}</TableCell>
                                <TableCell>
                                    <a
                                        href={`${lead.websiteUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {lead.domain}
                                    </a>
                                </TableCell>
                                <TableCell>{lead.contactPhone}</TableCell>
                                <TableCell align="right">
                                    {lead.icpScore !== null
                                        ? `${lead.icpScore}%`
                                        : "-"}
                                </TableCell>
                                <TableCell align="right">
                                    {lead.priorityScore !== null
                                        ? lead.priorityScore!.toFixed(2)
                                        : "-"}
                                </TableCell>
                                <TableCell>{lead.outreachAngle}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default LeadsTable;
