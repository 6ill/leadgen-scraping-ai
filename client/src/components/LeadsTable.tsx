import React, { useState, useMemo } from "react";
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
    TableSortLabel, 
    IconButton, 
    Collapse, 
    Typography, 
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; 
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';   
import { enrichLeads, evaluateLeads, type Lead } from "../api/lead";


type Order = 'asc' | 'desc';
type SortKey = 'priorityScore' | 'updatedAt' | 'companyName' | 'industry' | 'location' | 'websiteUrl' | 'numEmployees' ; 

interface LeadsTableProps {
    leads: Lead[];
    isLoading: boolean;
    onRefetch: () => void;
}
 // Sticky header constants
const ACTION_BAR_HEIGHT = 64; // Height of the action bar
const TABLE_HEADER_HEIGHT = 53; // Height of the table header

const LeadsTable: React.FC<LeadsTableProps> = ({
    leads,
    isLoading,
    onRefetch,
}) => {
    const [selected, setSelected] = useState<string[]>([]);
    const [isEnriching, setIsEnriching] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);

    
    const [orderBy, setOrderBy] = useState<SortKey>('updatedAt'); 
    const [order, setOrder] = useState<Order>('desc'); 

    
    const [expandedOutreachId, setExpandedOutreachId] = useState<string | null>(null);

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
            setSelected([]); 
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
            setSelected([]); 
        } catch (error) {
            console.error("Evaluation failed:", error);
        } finally {
            setIsEvaluating(false);
        }
    };

    
    const handleRequestSort = (property: SortKey) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    
    const sortedLeads = useMemo(() => {
        
        const sorted = [...leads].sort((a, b) => {
            let aValue: any;
            let bValue: any;

            if (orderBy === 'priorityScore') {
                
                aValue = a.priorityScore ?? 0;
                bValue = b.priorityScore ?? 0;
            } else if (orderBy === 'updatedAt') {
                
                aValue = a.updatedAt;
                bValue = b.updatedAt;
            } else {
                
                aValue = (a as any)[orderBy] ?? ''; 
                bValue = (b as any)[orderBy] ?? '';
            }

            if (aValue < bValue) {
                return order === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return order === 'asc' ? 1 : -1;
            }
            return 0; 
        });

        return sorted;
    }, [leads, order, orderBy]);

    
    const toggleOutreachAngle = (id: string) => {
        setExpandedOutreachId(prevId => (prevId === id ? null : id));
    };


    return (
        <TableContainer
            component={Paper}
            sx={{
                mt: 3,
                maxHeight: "calc(100vh - 200px)",
                overflow: "auto",
                position: "relative",
            }}
        >
            <Box
                sx={{
                    p: 2, 
                    display: "flex", 
                    gap: 2, 
                    position: "sticky",
                    left: 0,
                    top: 0,
                    zIndex: 2, 
                    backgroundColor: 'background.paper',
                    width: 'fit-content',
                    minWidth: '100%',
                    boxSizing: 'border-box',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Button
                    variant="outlined"
                    onClick={handleEnrich}
                    disabled={isEnriching || !selected.length}
                >
                    {isEnriching ? (
                        <CircularProgress size={24} />
                    ) : (
                        "Enrich Selected"
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
                        "Evaluate Selected"
                    )}
                </Button>
            </Box>
            <Table size="small" sx={{ minWidth: 1200 }} stickyHeader>
                <TableHead>
                    <TableRow
                        sx={{
                            position: "sticky",
                            top: ACTION_BAR_HEIGHT, // Positioned below action bar
                            zIndex: 2,
                            backgroundColor: "background.paper",
                            height: TABLE_HEADER_HEIGHT,
                        }}
                    >
                        {/* Table cells */}
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
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === "companyName"}
                                direction={
                                    orderBy === "companyName" ? order : "asc"
                                }
                                onClick={() => handleRequestSort("companyName")}
                            >
                                Company
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === "industry"}
                                direction={
                                    orderBy === "industry" ? order : "asc"
                                }
                                onClick={() => handleRequestSort("industry")}
                            >
                                Industry
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === "location"}
                                direction={
                                    orderBy === "location" ? order : "asc"
                                }
                                onClick={() => handleRequestSort("location")}
                            >
                                Location
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === "websiteUrl"}
                                direction={
                                    orderBy === "websiteUrl" ? order : "asc"
                                }
                                onClick={() => handleRequestSort("websiteUrl")}
                            >
                                Website
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>LinkedIn URL</TableCell>
                        <TableCell>Contact Phone</TableCell>
                        <TableCell align="right">
                            <TableSortLabel
                                active={orderBy === "numEmployees"}
                                direction={
                                    orderBy === "numEmployees" ? order : "asc"
                                }
                                onClick={() =>
                                    handleRequestSort("numEmployees")
                                }
                            >
                                Employees
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="right">
                            <TableSortLabel
                                active={orderBy === "priorityScore"}
                                direction={
                                    orderBy === "priorityScore" ? order : "desc"
                                }
                                onClick={() =>
                                    handleRequestSort("priorityScore")
                                }
                            >
                                Priority
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>Outreach Angle</TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === "updatedAt"}
                                direction={
                                    orderBy === "updatedAt" ? order : "desc"
                                }
                                onClick={() => handleRequestSort("updatedAt")}
                            >
                                Last Updated
                            </TableSortLabel>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={14} align="center">
                                <CircularProgress />
                            </TableCell>
                        </TableRow>
                    ) : sortedLeads.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={14} align="center">
                                No leads found. Try a different search.
                            </TableCell>
                        </TableRow>
                    ) : (
                        sortedLeads.map((lead) => (
                            <React.Fragment key={lead.id}>
                                <TableRow
                                    hover
                                    selected={selected.includes(lead.id)}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selected.includes(lead.id)}
                                            onChange={() =>
                                                handleSelect(lead.id)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>{lead.companyName}</TableCell>
                                    <TableCell>
                                        {lead.industry || "-"}
                                    </TableCell>
                                    <TableCell>
                                        {lead.location || "-"}
                                    </TableCell>
                                    <TableCell>
                                        <a
                                            href={lead.websiteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {lead.domain}
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        {lead.linkedinUrl ? (
                                            <a
                                                href={lead.linkedinUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                LinkedIn
                                            </a>
                                        ) : (
                                            "-"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {lead.contactPhone || "-"}
                                    </TableCell>
                                    <TableCell align="right">
                                        {lead.numEmployees ?? "-"}
                                    </TableCell>
                                    <TableCell align="right">
                                        {lead.priorityScore ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        {lead.outreachAngle ? (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    maxWidth: 200,
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    noWrap
                                                    sx={{ flexGrow: 1 }}
                                                >
                                                    {lead.outreachAngle}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        toggleOutreachAngle(
                                                            lead.id
                                                        )
                                                    }
                                                    sx={{ p: 0.5 }}
                                                >
                                                    {expandedOutreachId ===
                                                    lead.id ? (
                                                        <KeyboardArrowUpIcon />
                                                    ) : (
                                                        <KeyboardArrowDownIcon />
                                                    )}
                                                </IconButton>
                                            </Box>
                                        ) : (
                                            "-"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {lead.updatedAt
                                            ? new Date(
                                                  lead.updatedAt
                                              ).toLocaleDateString("en-US", {
                                                  day: "numeric",
                                                  month: "short",
                                                  year: "numeric",
                                              })
                                            : "-"}
                                    </TableCell>
                                </TableRow>
                                {expandedOutreachId === lead.id &&
                                    lead.outreachAngle && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={14}
                                                sx={{
                                                    paddingBottom: 0,
                                                    paddingTop: 0,
                                                    backgroundColor:
                                                        "action.hover",
                                                }}
                                            >
                                                <Collapse
                                                    in={
                                                        expandedOutreachId ===
                                                        lead.id
                                                    }
                                                    timeout="auto"
                                                    unmountOnExit
                                                >
                                                    <Box
                                                        sx={{
                                                            margin: 1,
                                                            p: 2,
                                                            backgroundColor:
                                                                "background.paper",
                                                            borderRadius: 1,
                                                            border: "1px solid",
                                                            borderColor:
                                                                "divider",
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            component="div"
                                                        >
                                                            <strong>
                                                                Outreach Angle:
                                                            </strong>
                                                            <br />
                                                            {lead.outreachAngle}
                                                        </Typography>
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    )}
                            </React.Fragment>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default LeadsTable;