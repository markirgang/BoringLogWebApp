const xlsx = require('xlsx');
const path = require('path');
const assert = require('assert');

const originalFile = '2026.2.16_template_working.xlsx';

const args = process.argv.slice(2);
if (args.length === 0) {
    console.error('Usage: node validate-export.js <exported_file.xlsx>');
    process.exit(1);
}

const exportedFile = args[0];

console.log(`Comparing original template: ${originalFile}`);
console.log(`With exported file: ${exportedFile}`);
console.log('--------------------------------------------------');

try {
    const originalWorkbook = xlsx.readFile(path.join(__dirname, originalFile));
    const exportedWorkbook = xlsx.readFile(path.join(__dirname, exportedFile));

    // Compare sheet names
    try {
        assert.deepStrictEqual(originalWorkbook.SheetNames, exportedWorkbook.SheetNames);
    } catch (e) {
        console.error('Sheet names do not match.');
        console.error('Original Sheets:', originalWorkbook.SheetNames);
        console.error('Exported Sheets:', exportedWorkbook.SheetNames);
        process.exit(1);
    }

    let hasErrors = false;

    originalWorkbook.SheetNames.forEach(sheetName => {
        const originalSheet = originalWorkbook.Sheets[sheetName];
        const exportedSheet = exportedWorkbook.Sheets[sheetName];
        
        // Convert both sheets to 2D arrays to easily compare cell by cell
        const originalData = xlsx.utils.sheet_to_json(originalSheet, { header: 1, defval: null });
        const exportedData = xlsx.utils.sheet_to_json(exportedSheet, { header: 1, defval: null });

        if (originalData.length !== exportedData.length) {
            console.error(`Row count mismatch in sheet "${sheetName}": Original has ${originalData.length}, Exported has ${exportedData.length}`);
            hasErrors = true;
        }
        
        const maxRows = Math.max(originalData.length, exportedData.length);
        for (let r = 0; r < maxRows; r++) {
            const originalRow = originalData[r] || [];
            const exportedRow = exportedData[r] || [];
            
            const maxCols = Math.max(originalRow.length, exportedRow.length);
            for (let c = 0; c < maxCols; c++) {
                let originalVal = originalRow[c];
                let exportedVal = exportedRow[c];
                
                // Treat null, undefined, and empty string as equivalent for comparison purposes
                if (originalVal === null || originalVal === undefined || originalVal === '') {
                    originalVal = '';
                }
                if (exportedVal === null || exportedVal === undefined || exportedVal === '') {
                    exportedVal = '';
                }
                
                // For strings, trim whitespace to avoid trivial mismatches
                if (typeof originalVal === 'string') originalVal = originalVal.trim();
                if (typeof exportedVal === 'string') exportedVal = exportedVal.trim();
                
                // For numbers, we can use a small tolerance if needed, but exact is fine for now
                if (originalVal !== exportedVal) {
                    console.error(`Mismatch in sheet "${sheetName}" at Row ${r + 1}, Column ${c + 1}:`);
                    console.error(`  Original = "${originalVal}"`);
                    console.error(`  Exported = "${exportedVal}"`);
                    hasErrors = true;
                }
            }
        }
    });

    if (hasErrors) {
        console.error('\nValidation FAILED: Differences found between the original and exported files.');
        process.exit(1);
    } else {
        console.log('\nValidation PASSED: The exported file matches the original template perfectly.');
    }
} catch (error) {
    console.error('An error occurred during validation:', error.message);
    process.exit(1);
}
