const express = require('express');
const path = require('path');
const ExcelJS = require('exceljs');

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// Serve static files from the current directory
app.use(express.static(path.join(__dirname, '')));

function addStyledSheet(workbook, sheetName, dataArray) {
    const worksheet = workbook.addWorksheet(sheetName);
    worksheet.views = [{ showGridLines: true }];

    if (!dataArray || dataArray.length === 0) return;

    // 1. Setup Column Headers
    const headers = Object.keys(dataArray[0]);
    const headerRow = worksheet.addRow(headers);
    headerRow.height = 26;

    headerRow.eachCell((cell) => {
        cell.font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: 'FF1E293B' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
        cell.border = {
            top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
            bottom: { style: 'medium', color: { argb: 'FF94A3B8' } },
            left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
            right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
        };
    });

    // 2. Setup Data Rows
    dataArray.forEach(rowData => {
        const rowValues = headers.map(h => rowData[h]);
        const dataRow = worksheet.addRow(rowValues);
        dataRow.height = 21;

        dataRow.eachCell((cell) => {
            cell.font = { name: 'Segoe UI', size: 12 };
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
            cell.border = {
                top: { style: 'thin', color: { argb: 'FFGRID' } },
                bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
            };
        });
    });

    // 3. Adaptive Auto-Fit Columns with Fixed Protection Ceilings
    worksheet.columns.forEach(column => {
        let maxLen = 0;
        column.eachCell({ includeEmpty: true }, cell => {
            const valueStr = cell.value ? cell.value.toString() : '';
            if (valueStr.length > maxLen) maxLen = valueStr.length;
        });
        column.width = Math.min(Math.max(maxLen + 4, 15), 35);
    });
}

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint for Excel generation
app.post('/api/export', async (req, res) => {
    try {
        const { coverData, datasetProfiles, datasetRuns, referenceSoilTypes } = req.body;
        const workbook = new ExcelJS.Workbook();

        if (coverData) addStyledSheet(workbook, "Cover Page", coverData);
        if (datasetProfiles) addStyledSheet(workbook, "Profiles", datasetProfiles);
        if (datasetRuns) addStyledSheet(workbook, "Boring Info", datasetRuns);
        if (referenceSoilTypes) addStyledSheet(workbook, "Soil Types (Reference)", referenceSoilTypes);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="Boring_Calculated_Export.xlsx"');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error generating export:', error);
        res.status(500).json({ error: 'Failed to generate Excel file' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
