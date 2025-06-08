import React, { useState } from "react";
import { Button } from "@mui/material";
import { exportData } from "../api/lead";

interface ExportButtonProps {
    disabled?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({ disabled }) => {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const response = await exportData();

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;

            // Extract filename from Content-Disposition header
            const contentDisposition = response.headers["content-disposition"];
            let fileName = "leads_export.xlsx";

            if (contentDisposition) {
                const fileNameMatch =
                    contentDisposition.match(/filename="(.+)"/);
                if (fileNameMatch.length === 2) {
                    fileName = fileNameMatch[1];
                }
            }

            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();

            // Clean up
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export failed:", error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button
            variant="contained"
            color="success"
            onClick={handleExport}
            disabled={disabled || isExporting}
            sx={{ ml: 2 }}
        >
            {isExporting ? "Exporting..." : "Export to Excel"}
        </Button>
    );
};

export default ExportButton;
