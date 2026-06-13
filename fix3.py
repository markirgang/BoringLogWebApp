import re

with open('c:/Users/marki/OneDrive/Desktop/BoringLogWebApp/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the button
old_btn = '<button class="tab-btn" onclick="switchTab(event, \'tab-calcs\')">5. Site Class & Bearing Metrics</button>'
new_btn = '<button class="tab-btn" onclick="switchTab(event, \'tab-calcs\')">5. Bearing Capacity</button>'
content = content.replace(old_btn, new_btn)

# 2. Update the HTML layout in tab-calcs
old_html = """    <div id="tab-calcs" class="tab-content">
        <h3>Engineering Calculations Matrix Preview</h3>
        <div class="grid-3">
            <div style="background:#f8fafc; padding:1rem; border:1px solid var(--border); border-radius:6px;">
                <h4 style="margin:0 0 0.5rem 0; color:var(--blue-600);">Calculated Site Class Metric</h4>
                <p style="font-size:1.25rem; font-weight:bold; margin:0;" id="calcSiteClass">Site Class E (Soft Soil Profile)</p>
                <small style="color:#64748b;">Based on parsed Harmonic Mean N calculations</small>
            </div>
            <div style="background:#f8fafc; padding:1rem; border:1px solid var(--border); border-radius:6px;">
                <h4 style="margin:0 0 0.5rem 0; color:var(--blue-600);">Allowable Bearing Capacity</h4>
                <p style="font-size:1.25rem; font-weight:bold; margin:0;">2.45 ksf</p>
                <small style="color:#64748b;">Estimated using empirical structural correlation</small>
            </div>
            <div style="background:#f8fafc; padding:1rem; border:1px solid var(--border); border-radius:6px;">
                <h4 style="margin:0 0 0.5rem 0; color:var(--blue-600);">Liquefaction Vulnerability Status</h4>
                <p style="font-size:1.25rem; font-weight:bold; margin:0; color:#b91c1c;">Low to Moderate</p>
                <small style="color:#64748b;">Assessed against Ground Water depth limits</small>
            </div>
        </div>
    </div>"""

new_html = """    <div id="tab-calcs" class="tab-content">
        <h3>Estimated Bearing Capacity by Boring</h3>
        <p>Calculated using empirical correlation: <strong>q<sub>a</sub> &approx; N / 4</strong> (where N is the harmonic mean SPT N-Value)</p>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Boring ID</th>
                        <th>Average N-Value</th>
                        <th>Estimated Bearing Capacity (ksf)</th>
                    </tr>
                </thead>
                <tbody id="bearingCapacityTableBody">
                </tbody>
            </table>
        </div>
    </div>"""
content = content.replace(old_html, new_html)

# 3. Update the JS logic
old_js = """    function calculateGeotechOutputs() {
        if(datasetRuns.length === 0) return;
        let sumInverseN = 0;
        datasetRuns.forEach(r => { sumInverseN += (r["SPT N-Value"] > 0) ? (1 / r["SPT N-Value"]) : 0; });
        let avgN = datasetRuns.length / sumInverseN;
        document.getElementById('calcSiteClass').textContent = `Site Class ${avgN < 15 ? 'E' : avgN <= 50 ? 'D' : 'C'} (Avg N: ${avgN.toFixed(2)})`;
    }"""

new_js = """    function calculateGeotechOutputs() {
        if(datasetRuns.length === 0) return;
        
        let borings = {};
        datasetRuns.forEach(r => {
            let b = r["Boring ID"];
            if (!borings[b]) borings[b] = [];
            borings[b].push(r);
        });

        let html = '';
        for (let b in borings) {
            let runs = borings[b];
            let sumInverseN = 0;
            let validRuns = 0;
            runs.forEach(r => {
                if (r["SPT N-Value"] > 0) {
                    sumInverseN += (1 / r["SPT N-Value"]);
                    validRuns++;
                }
            });
            let avgN = validRuns > 0 ? (validRuns / sumInverseN) : 0;
            let bearingCap = (avgN / 4).toFixed(2);
            html += `<tr>
                <td>${b}</td>
                <td>${avgN.toFixed(2)}</td>
                <td>${bearingCap}</td>
            </tr>`;
        }
        
        const tableBody = document.getElementById('bearingCapacityTableBody');
        if (tableBody) {
            tableBody.innerHTML = html;
        }
    }"""
content = content.replace(old_js, new_js)

# Update initialize to calculate on load
old_init = """    // Run baseline initialization loops on system load
    populateSampleDropdown();
    renderProfilesTable();
    renderRunsTable();"""
new_init = """    // Run baseline initialization loops on system load
    populateSampleDropdown();
    renderProfilesTable();
    renderRunsTable();
    calculateGeotechOutputs();"""
content = content.replace(old_init, new_init)

with open('c:/Users/marki/OneDrive/Desktop/BoringLogWebApp/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
