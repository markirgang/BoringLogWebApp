import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Chart.js to head
head_target = '</head>'
head_replacement = '    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>\n</head>'
content = content.replace(head_target, head_replacement)

# 2. Add canvas to Tab 6
tab6_target = '''    <div id="tab-reference" class="tab-content">
        <h3>Reference Soil Properties Matrix</h3>
        <p>Hardcoded static constants pulled from standard NAVFAC DM 7.01 & 7.02.</p>
        <div class="table-container">'''
tab6_replacement = '''    <div id="tab-reference" class="tab-content">
        <h3>Boring vs Bearing Capacity</h3>
        <div style="margin-bottom: 2rem; max-width: 800px;">
            <canvas id="bearingChart" width="400" height="200"></canvas>
        </div>
        <h3>Reference Soil Properties Matrix</h3>
        <p>Hardcoded static constants pulled from standard NAVFAC DM 7.01 & 7.02.</p>
        <div class="table-container">'''
content = content.replace(tab6_target, tab6_replacement)

# 3. Add chart update logic to calculateGeotechOutputs()
calc_target = '''        for (let b in borings) {
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
            let bearingCap = avgN / 4;
            
            totalCapacity += bearingCap;
            boringCount++;

            html += `<tr>
                <td>${b}</td>
                <td>${avgN.toFixed(2)}</td>
                <td>${bearingCap.toFixed(2)}</td>
            </tr>`;
        }
        
        const tableBody = document.getElementById('bearingCapacityTableBody');'''

calc_replacement = '''        let chartLabels = [];
        let chartData = [];
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
            let bearingCap = avgN / 4;
            
            totalCapacity += bearingCap;
            boringCount++;
            
            chartLabels.push(b);
            chartData.push(bearingCap.toFixed(2));

            html += `<tr>
                <td>${b}</td>
                <td>${avgN.toFixed(2)}</td>
                <td>${bearingCap.toFixed(2)}</td>
            </tr>`;
        }
        
        const ctx = document.getElementById('bearingChart');
        if (ctx) {
            if (window.bearingChartInstance) {
                window.bearingChartInstance.destroy();
            }
            window.bearingChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        label: 'Estimated Bearing Capacity (ksf)',
                        data: chartData,
                        backgroundColor: '#3b82f6',
                        borderColor: '#2563eb',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        
        const tableBody = document.getElementById('bearingCapacityTableBody');'''
content = content.replace(calc_target, calc_replacement)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done!")
