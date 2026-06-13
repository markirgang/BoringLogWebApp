import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the Chart Header
content = content.replace('<h3 style="margin-top: 0;">Boring vs. Estimated Bearing Capacity</h3>', 
                          '<h3 style="margin-top: 0;">Layer vs. Estimated Bearing Capacity</h3>')

# 2. Update the Chart Logic
target = '''        let chartLabels = [];
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
            chartData.push(parseFloat(bearingCap.toFixed(2)));

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
        }'''

replacement = '''        for (let b in borings) {
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
        
        let chartLabels = [];
        let chartData = [];
        let layerCompositions = [];
        
        datasetProfiles.forEach(layer => {
            let parentRun = datasetRuns.find(r => 
                (r["Boring ID"] + r["Sample ID"]) === layer["Sample ID"] || 
                r["Sample ID"] === layer["Sample ID"]
            );
            
            let nValue = parentRun ? parseFloat(parentRun["SPT N-Value"]) : 0;
            let layerCapacity = (nValue > 0) ? (nValue / 4) : 0;
            
            chartLabels.push(layer["Layer ID"]);
            chartData.push(parseFloat(layerCapacity.toFixed(2)));
            layerCompositions.push(layer["Soil Type"] || "Unknown");
        });
        
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
                    plugins: {
                        tooltip: {
                            callbacks: {
                                afterLabel: function(context) {
                                    return 'Soil Type: ' + layerCompositions[context.dataIndex];
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }'''

content = content.replace(target, replacement)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
