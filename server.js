const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');

const app = express();
const PORT = 3000;
const fs = require('fs');

// Support large payloads (for PDFs/images)
app.use(express.json({ limit: '50mb' }));

// Serve static files from the current directory
app.use(express.static(path.join(__dirname, '')));

// Endpoint to save exported files directly to the Desktop
app.post('/save-to-desktop', (req, res) => {
    const { filename, data } = req.body;
    if (!filename || !data) {
        return res.status(400).send("Missing filename or data");
    }

    try {
        const homedir = require('os').homedir();
        let desktopPath = path.join(homedir, 'Desktop');

        // Check if OneDrive Desktop folder exists (since workspace is on OneDrive/Desktop)
        const oneDriveDesktop = path.join(homedir, 'OneDrive', 'Desktop');
        if (fs.existsSync(oneDriveDesktop)) {
            desktopPath = oneDriveDesktop;
        } else {
            // Check for other OneDrive folders
            try {
                const contents = fs.readdirSync(homedir);
                const oneDriveDirs = contents.filter(f => f.toLowerCase().startsWith('onedrive'));
                for (const dir of oneDriveDirs) {
                    const checkPath = path.join(homedir, dir, 'Desktop');
                    if (fs.existsSync(checkPath)) {
                        desktopPath = checkPath;
                        break;
                    }
                }
            } catch (e) {
                console.warn("Could not read home directory to check OneDrive path:", e.message);
            }
        }

        // We will generate a unique temporary filename for a temporary .ps1 file
        const tempScriptFilename = `temp_dialog_${Date.now()}_${Math.floor(Math.random() * 1000)}.ps1`;
        const tempScriptPath = path.join(__dirname, tempScriptFilename);

        const ext = path.extname(filename).toLowerCase();
        let filterStr = 'All files (*.*)|*.*';
        if (ext === '.pdf') {
            filterStr = 'PDF files (*.pdf)|*.pdf|All files (*.*)|*.*';
        } else if (ext === '.xlsx') {
            filterStr = 'Excel files (*.xlsx)|*.xlsx|All files (*.*)|*.*';
        }

        const psScriptContent = `Add-Type -AssemblyName System.Windows.Forms
$f = New-Object System.Windows.Forms.SaveFileDialog
$f.InitialDirectory = '${desktopPath.replace(/'/g, "''")}'
$f.FileName = '${filename.replace(/'/g, "''")}'
$f.Title = 'Save Exported File'
$f.Filter = '${filterStr}'
if ($f.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
    Write-Output $f.FileName
} else {
    Write-Output 'CANCELLED'
}
`;

        fs.writeFile(tempScriptPath, psScriptContent, (err) => {
            if (err) {
                console.error("Error writing temporary PS script:", err);
                return res.status(500).send("Failed to initiate save dialog: " + err.message);
            }

            const { exec } = require('child_process');
            exec(`powershell -NoProfile -ExecutionPolicy Bypass -File "${tempScriptPath}"`, (execErr, stdout, stderr) => {
                // Delete the temporary script file
                fs.unlink(tempScriptPath, (unlinkErr) => {
                    if (unlinkErr) console.error("Error deleting temp PS script:", unlinkErr);
                });

                if (execErr) {
                    console.error("PowerShell script execution error:", execErr);
                    return res.status(500).send("Save dialog execution failed: " + execErr.message);
                }

                const chosenPath = stdout.trim();
                if (chosenPath === 'CANCELLED' || !chosenPath) {
                    // Return success but cancelled flag so client knows not to show an error
                    return res.send({ success: false, cancelled: true });
                }

                const buffer = Buffer.from(data, 'base64');
                fs.writeFile(chosenPath, buffer, (writeErr) => {
                    if (writeErr) {
                        console.error("Error writing file to chosen path:", writeErr);
                        return res.status(500).send("Failed to save file: " + writeErr.message);
                    }
                    console.log(`Saved export file to: ${chosenPath}`);
                    res.send({ success: true, path: chosenPath });
                });
            });
        });
    } catch (err) {
        console.error("Error inside save-to-desktop route:", err);
        res.status(500).send("Server error: " + err.message);
    }
});

// Proxy endpoint to bypass CORS for downloading PDFs
app.get('/proxy-pdf', (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send("No URL provided");
    
    const client = targetUrl.startsWith('https') ? https : http;
    client.get(targetUrl, (proxyRes) => {
        // Only set headers that are safe to proxy
        if (proxyRes.headers['content-type']) {
            res.setHeader('Content-Type', proxyRes.headers['content-type']);
        }
        if (proxyRes.headers['content-length']) {
            res.setHeader('Content-Length', proxyRes.headers['content-length']);
        }
        res.status(proxyRes.statusCode);
        proxyRes.pipe(res);
    }).on('error', (err) => {
        res.status(500).send(err.message);
    });
});

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
