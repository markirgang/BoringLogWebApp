

    // Custom drop-down choice appending routine
    function populateSampleDropdown() {
        const boringSelect = document.getElementById('rel_boring_id');
        const sourceBoringSelect = document.getElementById('run_boring_id');
        if (!boringSelect || !sourceBoringSelect) return;
        
        const currentSelection = boringSelect.value;
        boringSelect.innerHTML = '';
        
        for (let i = 0; i < sourceBoringSelect.options.length; i++) {
            const opt = document.createElement('option');
            opt.value = sourceBoringSelect.options[i].value;
            opt.text = sourceBoringSelect.options[i].text;
            boringSelect.add(opt);
        }
        
        let found = false;
        for (let i = 0; i < boringSelect.options.length; i++) {
            if (boringSelect.options[i].value === currentSelection) {
                found = true;
                break;
            }
        }
        if (found) {
            boringSelect.value = currentSelection;
        } else if (boringSelect.options.length > 0) {
            boringSelect.value = boringSelect.options[0].value;
        }
    }

    function promptAddChoice(selectElementId) {
        const selectElement = document.getElementById(selectElementId);
        const inputPrompt = prompt("Type your new custom value choice below:");
        
        if (inputPrompt && inputPrompt.trim() !== "") {
            const cleanValue = inputPrompt.trim();
            let optionExists = false;
            for (let i = 0; i < selectElement.options.length; i++) {
                if (selectElement.options[i].value === cleanValue) {
                    optionExists = true;
                    break;
                }
            }
            
            if (!optionExists) {
                const newOption = document.createElement("option");
                newOption.text = cleanValue;
                newOption.value = cleanValue;
                selectElement.add(newOption);
                selectElement.value = cleanValue;
            } else {
                selectElement.value = cleanValue;
            }
            
            if (selectElementId === 'run_boring_id') {
                populateSampleDropdown();
            }
        }
    }

    // Active View Tab switcher
    function switchTab(event, tabId) {
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        
        document.getElementById(tabId).classList.add('active');
        event.currentTarget.classList.add('active');
    }

    // Stateful Data storage arrays with built-in reference placeholders
    let datasetProfiles = [
        // B1: Deep and highly stratified
        { "Sample ID": "B1S1", "Layer ID": "B1S1L1", "Top Depth (ft)": 0.0, "Bottom Depth (ft)": 0.5, "Soil Type": "TOPSOIL", "Color": "Dark Brown", "Moisture Condition": "damp", "Comments": "Dark organic matter with roots" },
        { "Sample ID": "B1S1", "Layer ID": "B1S1L2", "Top Depth (ft)": 0.5, "Bottom Depth (ft)": 1.5, "Soil Type": "FINE SAND", "Color": "Light Brown", "Moisture Condition": "dry", "Comments": "Trace silt" },
        { "Sample ID": "B1S1", "Layer ID": "B1S1L3", "Top Depth (ft)": 1.5, "Bottom Depth (ft)": 2.0, "Soil Type": "FINE TO MEDIUM SAND", "Color": "Brown", "Moisture Condition": "moist", "Comments": "Well graded" },
        { "Sample ID": "B1S2", "Layer ID": "B1S2L1", "Top Depth (ft)": 2.0, "Bottom Depth (ft)": 3.0, "Soil Type": "FINE TO MEDIUM SAND", "Color": "Brown", "Moisture Condition": "moist", "Comments": "Continued" },
        { "Sample ID": "B1S2", "Layer ID": "B1S2L2", "Top Depth (ft)": 3.0, "Bottom Depth (ft)": 4.0, "Soil Type": "SILTY FINE SAND", "Color": "Tan", "Moisture Condition": "wet", "Comments": "Increased fines" },
        { "Sample ID": "B1S3", "Layer ID": "B1S3L1", "Top Depth (ft)": 4.0, "Bottom Depth (ft)": 6.0, "Soil Type": "CLAYEY SILT", "Color": "Gray", "Moisture Condition": "wet", "Comments": "Low plasticity, stiff" },
        { "Sample ID": "B1S4", "Layer ID": "B1S4L1", "Top Depth (ft)": 6.0, "Bottom Depth (ft)": 8.0, "Soil Type": "CLAY", "Color": "Dark Gray", "Moisture Condition": "wet", "Comments": "Very stiff, high plasticity" },
        
        // B2: Typical Pavement Section
        { "Sample ID": "B2S1", "Layer ID": "B2S1L1", "Top Depth (ft)": 0.0, "Bottom Depth (ft)": 0.3, "Soil Type": "ASPHALT", "Color": "Black", "Moisture Condition": "dry", "Comments": "Parking lot surface" },
        { "Sample ID": "B2S1", "Layer ID": "B2S1L2", "Top Depth (ft)": 0.3, "Bottom Depth (ft)": 1.0, "Soil Type": "BASE COURSE", "Color": "Gray", "Moisture Condition": "dry", "Comments": "Crushed gravel base" },
        { "Sample ID": "B2S1", "Layer ID": "B2S1L3", "Top Depth (ft)": 1.0, "Bottom Depth (ft)": 2.0, "Soil Type": "FILL", "Color": "Brown", "Moisture Condition": "moist", "Comments": "Reworked native soil" },
        { "Sample ID": "B2S2", "Layer ID": "B2S2L1", "Top Depth (ft)": 2.0, "Bottom Depth (ft)": 4.0, "Soil Type": "SILTY FINE SAND", "Color": "Light Gray", "Moisture Condition": "wet", "Comments": "Loose" },

        // B3: Debris and clay
        { "Sample ID": "B3S1", "Layer ID": "B3S1L1", "Top Depth (ft)": 0.0, "Bottom Depth (ft)": 2.0, "Soil Type": "FILL", "Color": "Mottled Brown", "Moisture Condition": "moist", "Comments": "Construction debris, brick fragments" },
        { "Sample ID": "B3S2", "Layer ID": "B3S2L1", "Top Depth (ft)": 2.0, "Bottom Depth (ft)": 4.0, "Soil Type": "CLAY", "Color": "Dark Gray", "Moisture Condition": "wet", "Comments": "High plasticity, very stiff" },
        
        // B4: All sand layers, deep
        { "Sample ID": "B4S1", "Layer ID": "B4S1L1", "Top Depth (ft)": 0.0, "Bottom Depth (ft)": 1.0, "Soil Type": "TOPSOIL", "Color": "Brown", "Moisture Condition": "damp", "Comments": "" },
        { "Sample ID": "B4S1", "Layer ID": "B4S1L2", "Top Depth (ft)": 1.0, "Bottom Depth (ft)": 2.0, "Soil Type": "FINE SAND", "Color": "Tan", "Moisture Condition": "dry", "Comments": "" },
        { "Sample ID": "B4S2", "Layer ID": "B4S2L1", "Top Depth (ft)": 2.0, "Bottom Depth (ft)": 4.0, "Soil Type": "FINE TO MEDIUM SAND", "Color": "Tan", "Moisture Condition": "dry", "Comments": "Clean" },
        { "Sample ID": "B4S3", "Layer ID": "B4S3L1", "Top Depth (ft)": 4.0, "Bottom Depth (ft)": 5.0, "Soil Type": "MEDIUM SAND", "Color": "Light Brown", "Moisture Condition": "moist", "Comments": "" },
        { "Sample ID": "B4S3", "Layer ID": "B4S3L2", "Top Depth (ft)": 5.0, "Bottom Depth (ft)": 6.0, "Soil Type": "COARSE SAND", "Color": "Brown", "Moisture Condition": "wet", "Comments": "Trace fine gravel" },
        
        // B5: Alternating Thin Layers
        { "Sample ID": "B5S1", "Layer ID": "B5S1L1", "Top Depth (ft)": 0.0, "Bottom Depth (ft)": 0.5, "Soil Type": "SILTY SAND", "Color": "Gray", "Moisture Condition": "moist", "Comments": "" },
        { "Sample ID": "B5S1", "Layer ID": "B5S1L2", "Top Depth (ft)": 0.5, "Bottom Depth (ft)": 1.0, "Soil Type": "CLAYEY SILT", "Color": "Dark Gray", "Moisture Condition": "moist", "Comments": "" },
        { "Sample ID": "B5S1", "Layer ID": "B5S1L3", "Top Depth (ft)": 1.0, "Bottom Depth (ft)": 1.5, "Soil Type": "SILTY SAND", "Color": "Gray", "Moisture Condition": "moist", "Comments": "" },
        { "Sample ID": "B5S1", "Layer ID": "B5S1L4", "Top Depth (ft)": 1.5, "Bottom Depth (ft)": 2.0, "Soil Type": "CLAYEY SILT", "Color": "Dark Gray", "Moisture Condition": "moist", "Comments": "" },
        
        // B6: Shallow Refusal
        { "Sample ID": "B6S1", "Layer ID": "B6S1L1", "Top Depth (ft)": 0.0, "Bottom Depth (ft)": 0.5, "Soil Type": "ASPHALT", "Color": "Black", "Moisture Condition": "dry", "Comments": "" },
        { "Sample ID": "B6S1", "Layer ID": "B6S1L2", "Top Depth (ft)": 0.5, "Bottom Depth (ft)": 1.5, "Soil Type": "BASE COURSE", "Color": "Gray", "Moisture Condition": "dry", "Comments": "Large cobbles" }
    ];

    let datasetRuns = [
        { "Boring ID": "B1", "Sample ID": "B1S1", "Start Depth (ft)": 0.0, "End Depth (ft)": 2.0, "SPT N-Value": 6, "Recovery (in)": 18, "Field Testing Notes": "PID: 0.0 ppm", "Comments": "" },
        { "Boring ID": "B1", "Sample ID": "B1S2", "Start Depth (ft)": 2.0, "End Depth (ft)": 4.0, "SPT N-Value": 8, "Recovery (in)": 16, "Field Testing Notes": "PID: 0.0 ppm", "Comments": "" },
        { "Boring ID": "B1", "Sample ID": "B1S3", "Start Depth (ft)": 4.0, "End Depth (ft)": 6.0, "SPT N-Value": 14, "Recovery (in)": 22, "Field Testing Notes": "PID: 0.0 ppm", "Comments": "Groundwater encountered at 5ft" },
        { "Boring ID": "B1", "Sample ID": "B1S4", "Start Depth (ft)": 6.0, "End Depth (ft)": 8.0, "SPT N-Value": 22, "Recovery (in)": 24, "Field Testing Notes": "PID: 0.0 ppm", "Comments": "Hard drilling" },
        
        { "Boring ID": "B2", "Sample ID": "B2S1", "Start Depth (ft)": 0.0, "End Depth (ft)": 2.0, "SPT N-Value": 12, "Recovery (in)": 15, "Field Testing Notes": "PID: 0.2 ppm", "Comments": "Drilled through asphalt" },
        { "Boring ID": "B2", "Sample ID": "B2S2", "Start Depth (ft)": 2.0, "End Depth (ft)": 4.0, "SPT N-Value": 5, "Recovery (in)": 20, "Field Testing Notes": "PID: 0.0 ppm", "Comments": "Loose sandy layer" },

        { "Boring ID": "B3", "Sample ID": "B3S1", "Start Depth (ft)": 0.0, "End Depth (ft)": 2.0, "SPT N-Value": 18, "Recovery (in)": 10, "Field Testing Notes": "PID: 1.5 ppm", "Comments": "Auger refusal on debris at 1.8ft" },
        { "Boring ID": "B3", "Sample ID": "B3S2", "Start Depth (ft)": 2.0, "End Depth (ft)": 4.0, "SPT N-Value": 25, "Recovery (in)": 24, "Field Testing Notes": "PID: 0.0 ppm", "Comments": "Very stiff clay, hard drilling" },
        
        { "Boring ID": "B4", "Sample ID": "B4S1", "Start Depth (ft)": 0.0, "End Depth (ft)": 2.0, "SPT N-Value": 4, "Recovery (in)": 24, "Field Testing Notes": "PID: 0.0 ppm", "Comments": "" },
        { "Boring ID": "B4", "Sample ID": "B4S2", "Start Depth (ft)": 2.0, "End Depth (ft)": 4.0, "SPT N-Value": 7, "Recovery (in)": 24, "Field Testing Notes": "PID: 0.0 ppm", "Comments": "" },
        { "Boring ID": "B4", "Sample ID": "B4S3", "Start Depth (ft)": 4.0, "End Depth (ft)": 6.0, "SPT N-Value": 12, "Recovery (in)": 20, "Field Testing Notes": "PID: 0.0 ppm", "Comments": "" },

        { "Boring ID": "B5", "Sample ID": "B5S1", "Start Depth (ft)": 0.0, "End Depth (ft)": 2.0, "SPT N-Value": 8, "Recovery (in)": 18, "Field Testing Notes": "PID: 0.0 ppm", "Comments": "Interbedded lenses" },
        
        { "Boring ID": "B6", "Sample ID": "B6S1", "Start Depth (ft)": 0.0, "End Depth (ft)": 1.5, "SPT N-Value": 50, "Recovery (in)": 6, "Field Testing Notes": "PID: 0.0 ppm", "Comments": "Refusal at 1.5 ft" }
    ];

    const referenceSoilTypes = [
        { "Major Soil Type": "fine SAND", "Behavior": "granular", "Cohesionless Min N": 0, "Cohesionless Max N": 4, "Density Status": "Very loose", "Material Profile": "FINE SAND", "Max Weight (pcf)": 136, "Min Weight (pcf)": 84 },
        { "Major Soil Type": "fine to medium SAND", "Behavior": "granular", "Cohesionless Min N": 4, "Cohesionless Max N": 10, "Density Status": "Loose", "Material Profile": "MEDIUM SAND", "Max Weight (pcf)": 136, "Min Weight (pcf)": 84 },
        { "Major Soil Type": "fine to coarse SAND", "Behavior": "granular", "Cohesionless Min N": 10, "Cohesionless Max N": 30, "Density Status": "Medium dense", "Material Profile": "COARSE SAND", "Max Weight (pcf)": 136, "Min Weight (pcf)": 84 }
    ];

    let layerCounters = {};

    document.getElementById('sampleLayerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        let boringId = document.getElementById('rel_boring_id').value;
        let sampleId = document.getElementById('rel_sample_id').value;
        let layerNum = document.getElementById('rel_layer_id').value;
        if (!boringId || !sampleId || !layerNum) return;
        
        let combinedSampleId = boringId + sampleId;
        let layerId = combinedSampleId + layerNum;

        let existingIndex = datasetProfiles.findIndex(p => p["Layer ID"] === layerId);
        if (existingIndex !== -1) {
            datasetProfiles.splice(existingIndex, 1);
        }

        datasetProfiles.push({
            "Sample ID": combinedSampleId,
            "Layer ID": layerId,
            "Top Depth (ft)": parseFloat(document.getElementById('rel_top').value) || 0,
            "Bottom Depth (ft)": parseFloat(document.getElementById('rel_bottom').value) || 0,
            "Color": document.getElementById('rel_color').value,
            "Primary Size": document.getElementById('rel_primary_size').value,
            "Soil Type": document.getElementById('rel_soil').value,
            "Minor 1": document.getElementById('rel_minor_1').value,
            "Minor 2": document.getElementById('rel_minor_2').value,
            "Minor 3": document.getElementById('rel_minor_3').value,
            "Moisture Condition": document.getElementById('rel_moisture').value,
            "Comments": ""
        });
        renderProfilesTable();
        calculateGeotechOutputs();
        renderBurmisterTable();
    });

    document.getElementById('runForm').addEventListener('submit', function(e) {
        e.preventDefault();
        let boringRaw = document.getElementById('run_boring_id').value;
        let sampleRaw = document.getElementById('run_id').value;
        let newSampleId = boringRaw + sampleRaw;
        
        let existingIndex = datasetRuns.findIndex(r => r["Sample ID"] === newSampleId);
        if (existingIndex !== -1) {
            datasetRuns.splice(existingIndex, 1);
        }

        datasetRuns.push({
            "Boring ID": boringRaw,
            "Date": document.getElementById('run_date').value,
            "Sample ID": newSampleId,
            "Start Depth (ft)": parseFloat(document.getElementById('run_start').value) || 0,
            "End Depth (ft)": parseFloat(document.getElementById('run_end').value) || 0,
            "SPT N-Value": parseInt(document.getElementById('run_nval').value) || 0,
            "Recovery (in)": parseInt(document.getElementById('run_rec').value) || 0,
            "Field Testing Notes": document.getElementById('run_field_data').value,
            "Comments": document.getElementById('run_comments').value
        });

        if (!layerCounters[newSampleId]) layerCounters[newSampleId] = 0;

        renderRunsTable();
        calculateGeotechOutputs();
        populateSampleDropdown();
        document.getElementById('run_comments').value = '';
    });

    // Tab 2 Live Profile Table Inline Comment Field Binder
    function renderProfilesTable() {
        const html = datasetProfiles.map((p, index) => `
            <tr>
                <td>${p["Layer ID"] || p["Sample ID"]}</td>
                <td>${Number(p["Top Depth (ft)"]).toFixed(1)}</td>
                <td>${Number(p["Bottom Depth (ft)"]).toFixed(1)}</td>
                <td>${p["Soil Type"]}</td>
                <td>${p["Moisture Condition"]}</td>
                <td>
                    <input type="text" class="table-comment-input" value="${p["Comments"] || ''}" 
                           oninput="updateProfileInlineComment(${index}, this.value)" 
                           placeholder="Type layer remarks directly here...">
                </td>
                <td>
                    <button class="btn-small" style="background:#fecaca; color:#b91c1c; border-color:#fca5a5;" onclick="deleteProfile(${index})">Delete</button>
                </td>
            </tr>
        `).join('');
        
        let sampleLayerTbody = document.getElementById('sampleLayerTableBody');
        if(sampleLayerTbody) sampleLayerTbody.innerHTML = html;
    }

    function deleteProfile(index) {
        datasetProfiles.splice(index, 1);
        renderProfilesTable();
        calculateGeotechOutputs();
        renderBurmisterTable();
    }

    function updateProfileInlineComment(index, val) {
        datasetProfiles[index]["Comments"] = val;
    }

    // Live Run Table Inline Comment Field Binder
    function renderRunsTable() {
        document.getElementById('runTableBody').innerHTML = datasetRuns.map((r, index) => `
            <tr>
                <td>${r["Boring ID"]}</td>
                <td>${r["Date"] || ''}</td>
                <td>${r["Sample ID"]}</td>
                <td>${Number(r["Start Depth (ft)"]).toFixed(1)}</td>
                <td>${Number(r["End Depth (ft)"]).toFixed(1)}</td>
                <td>${r["SPT N-Value"]}</td>
                <td>${r["Recovery (in)"]}</td>
                <td>${r["Field Testing Notes"]}</td>
                <td>
                    <input type="text" class="table-comment-input" value="${r["Comments"] || ''}" 
                           oninput="updateInlineComment(${index}, this.value)" 
                           placeholder="Type comment here...">
                </td>
                <td>
                    <button class="btn-small" style="background:#fecaca; color:#b91c1c; border-color:#fca5a5;" onclick="deleteRun(${index})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    function deleteRun(index) {
        datasetRuns.splice(index, 1);
        renderRunsTable();
        calculateGeotechOutputs();
        renderBurmisterTable();
    }

    function updateInlineComment(index, val) {
        datasetRuns[index]["Comments"] = val;
    }

    function getRelativeDensity(nValue, soilType) {
        if (!nValue || nValue <= 0) return "";
        let isCohesive = soilType.includes("CLAY") || soilType.includes("SILT") && !soilType.includes("SAND");
        let ref = referenceSoilTypes.find(r => r["Major Soil Type"] === soilType);
        let behavior = ref ? ref["Behavior"] : (isCohesive ? "cohesive" : "granular");
        
        if (behavior === "granular") {
            if (nValue <= 4) return "Very loose";
            if (nValue <= 10) return "Loose";
            if (nValue <= 30) return "Medium dense";
            if (nValue <= 50) return "Dense";
            return "Very dense";
        } else {
            if (nValue <= 2) return "Very soft";
            if (nValue <= 4) return "Soft";
            if (nValue <= 8) return "Medium stiff";
            if (nValue <= 15) return "Stiff";
            if (nValue <= 30) return "Very stiff";
            return "Hard";
        }
    }

    function generateBurmisterDescription(layer) {
        let parts = [];
        
        // Color
        if (layer["Color"]) parts.push(layer["Color"]);
        
        // Primary Size + Soil Type
        let major = "";
        if (layer["Primary Size"]) major += layer["Primary Size"] + " ";
        if (layer["Soil Type"]) major += layer["Soil Type"];
        if (major.trim()) parts.push(major.trim());
        
        // Minors
        if (layer["Minor 1"]) parts.push(layer["Minor 1"]);
        if (layer["Minor 2"]) parts.push(layer["Minor 2"]);
        if (layer["Minor 3"]) parts.push(layer["Minor 3"]);
        
        // Moisture
        if (layer["Moisture Condition"]) parts.push(layer["Moisture Condition"]);
        
        // Relative Density (calc from N-value of run)
        let parentRun = datasetRuns.find(r => 
            (r["Boring ID"] + r["Sample ID"]) === layer["Sample ID"] || 
            r["Sample ID"] === layer["Sample ID"]
        );
        let nValue = parentRun ? parseFloat(parentRun["SPT N-Value"]) : 0;
        let density = getRelativeDensity(nValue, layer["Soil Type"] || "");
        if (density) parts.push(density);
        
        return parts.join(", ");
    }

    function renderBurmisterTable() {
        const html = datasetProfiles.map((p, index) => {
            let desc = generateBurmisterDescription(p);
            return `
            <tr>
                <td>${p["Layer ID"] || p["Sample ID"]}</td>
                <td>${Number(p["Top Depth (ft)"]).toFixed(1)}</td>
                <td>${Number(p["Bottom Depth (ft)"]).toFixed(1)}</td>
                <td>${desc}</td>
            </tr>
            `;
        }).join('');
        
        let tBody = document.getElementById('burmisterTableBody');
        if (tBody) tBody.innerHTML = html;
    }

    function calculateGeotechOutputs() {
        try {
            renderStackingReport();
            try { renderPresentationLog(); } catch(e) { console.error(e); }
        } catch(e) {
            console.error("Stacking report error", e);
        }

        if(datasetRuns.length === 0) {
            const container = document.getElementById('stackingReportContainer');
            if (container) container.innerHTML = '<p style="color: #64748b; font-style: italic; width: 100%; text-align: center;">No boring data available to stack.</p>';
            return;
        }
        
        let borings = {};
        datasetRuns.forEach(r => {
            let b = r["Boring ID"];
            if (!borings[b]) borings[b] = [];
            borings[b].push(r);
        });

        let html = '';
        let totalCapacity = 0;
        let boringCount = 0;

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
                window.bearingChartInstance.data.labels = chartLabels;
                window.bearingChartInstance.data.datasets[0].data = chartData;
                window.bearingChartInstance.options.plugins.tooltip.callbacks.afterLabel = function(context) {
                    return 'Soil Type: ' + layerCompositions[context.dataIndex];
                };
                window.bearingChartInstance.update();
            } else {
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
            }
        }
        
        const tableBody = document.getElementById('bearingCapacityTableBody');
        if (tableBody) {
            tableBody.innerHTML = html;
        }

        const overallElement = document.getElementById('overallAverageCapacity');
        if (overallElement && boringCount > 0) {
            let overallAvg = totalCapacity / boringCount;
            overallElement.textContent = `${overallAvg.toFixed(2)} ksf`;
        }
    }

    function getSoilGraphicClass(soilType) {
        if (!soilType) return "soil-graphic-default";
        let st = soilType.toUpperCase();
        if (st.includes("ASPHALT")) return "soil-graphic-asphalt";
        if (st.includes("TOPSOIL")) return "soil-graphic-topsoil";
        if (st.includes("FILL")) return "soil-graphic-fill";
        if (st.includes("BASE COURSE") || st.includes("GRAVEL")) return "soil-graphic-base-course";
        if (st.includes("SILTY FINE SAND") || st.includes("SILTY SAND")) return "soil-graphic-silty-sand";
        if (st.includes("FINE TO MEDIUM SAND") || st.includes("MEDIUM SAND") || st.includes("COARSE SAND")) return "soil-graphic-medium-sand";
        if (st.includes("FINE SAND") || st.includes("SAND")) return "soil-graphic-fine-sand";
        if (st.includes("CLAY") || st.includes("SILT")) return "soil-graphic-clay-silt";
        return "soil-graphic-default";
    }

    function renderStackingReport() {
        const container = document.getElementById('stackingReportContainer');
        if (!container) return;
        
        let borings = {};
        
        // Group runs (samples) by boring
        datasetRuns.forEach(r => {
            let bId = r["Boring ID"];
            if (!borings[bId]) borings[bId] = [];
            borings[bId].push({...r});
        });

        // Group layers by sample
        let layersBySample = {};
        datasetProfiles.forEach(layer => {
            let sId = layer["Sample ID"];
            if (!layersBySample[sId]) layersBySample[sId] = [];
            layersBySample[sId].push({...layer});
        });

        let html = '';
        
        // Sort borings alphabetically
        let boringIds = Object.keys(borings).sort();
        
        boringIds.forEach(bId => {
            let runs = borings[bId];
            
            // Calculate Bearing Capacity for this boring
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

            // Sort samples by start depth
            runs.sort((a, b) => a["Start Depth (ft)"] - b["Start Depth (ft)"]);
            
            let samplesHtml = '';
            
            runs.forEach(run => {
                let sampleFullId = run["Sample ID"];
                if (!sampleFullId.startsWith(run["Boring ID"])) {
                    sampleFullId = run["Boring ID"] + sampleFullId;
                }
                
                let startDepth = run["Start Depth (ft)"];
                let endDepth = run["End Depth (ft)"];
                let totalFeet = (endDepth - startDepth).toFixed(1);
                
                let layers = layersBySample[sampleFullId] || [];
                // Sort layers by top depth
                layers.sort((a, b) => a["Top Depth (ft)"] - b["Top Depth (ft)"]);
                
                let layersHtml = '';
                layers.forEach(layer => {
                    let lTop = layer["Top Depth (ft)"];
                    let lBottom = layer["Bottom Depth (ft)"];
                    let soilType = layer["Soil Type"] || "-";
                    let desc = generateBurmisterDescription(layer);
                    
                    let heightPx = Math.max(40, (lBottom - lTop) * 60);
                    let soilClass = getSoilGraphicClass(soilType);
                    
                    layersHtml += `
                        <div class="stacking-layer-block" style="min-height: ${heightPx}px; display: flex; padding: 0; flex-direction: row;">
                            <div class="${soilClass}" style="width: 40px; border-right: 1px solid #cbd5e1; flex-shrink: 0;"></div>
                            <div style="padding: 0.5rem; flex: 1; display: flex; flex-direction: column; overflow: hidden;">
                                <div class="stacking-layer-depth">${lTop.toFixed(1)}' - ${lBottom.toFixed(1)}'</div>
                                <div class="stacking-layer-soil">${soilType}</div>
                                <div class="stacking-layer-desc" style="margin-top: 0.25rem;">${desc}</div>
                            </div>
                        </div>
                    `;
                });
                
                if (layers.length === 0) {
                    layersHtml = `<div class="stacking-layer-block" style="color: #94a3b8; font-style: italic; text-align: center;">No layers defined</div>`;
                }

                let sampleHeightPx = Math.max(80, totalFeet * 60);
                
                samplesHtml += `
                    <div class="stacking-sample-block" style="min-height: ${sampleHeightPx}px;">
                        <div class="stacking-sample-header">${sampleFullId} (${totalFeet} ft) [${startDepth.toFixed(1)}' - ${endDepth.toFixed(1)}']</div>
                        ${layersHtml}
                    </div>
                `;
            });
            
            if (runs.length === 0) {
                samplesHtml = `<div style="padding: 1rem; color: #94a3b8; text-align: center;">No samples</div>`;
            }
            
            html += `
                <div class="stacking-boring-col" style="display: flex; flex-direction: column;">
                    <div class="stacking-boring-name" style="font-size: 1.1rem; font-weight: bold; padding-bottom: 0.5rem; text-align: center; border-bottom: 2px solid #cbd5e1; margin-bottom: 0.5rem;">${bId}</div>
                    <div class="stacking-samples-container" style="flex: 1;">
                        ${samplesHtml}
                    </div>
                    <div style="background: var(--slate-800); color: white; padding: 0.5rem; text-align: center; font-weight: bold; border-radius: 0 0 4px 4px; font-size: 0.9rem; margin-top: auto;">
                        Capacity: ${bearingCap.toFixed(2)} ksf
                    </div>
                </div>
            `;
        });
        
        if (boringIds.length === 0) {
            html = '<p style="color: #64748b; font-style: italic; width: 100%; text-align: center;">No boring data available to stack.</p>';
        }
        
        container.innerHTML = html;
    }

    /**
     * DYNAMIC EXCELJS ENGINE WITH ADVANCED LAYOUT CONTROLS
     */
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
                    top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
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

    // Workbook Generation Loop Trigger
    document.getElementById('exportBtn').addEventListener('click', function() {
        const workbook = new ExcelJS.Workbook();

        // Helper to safely get values
        const getVal = (id) => document.getElementById(id) ? document.getElementById(id).value : "";

        // Mapped core information matrix
        const coverData = [
            { Property: "Date", Value: getVal('cov_date') },
            { Property: "Project Name", Value: getVal('cov_project') },
            { Property: "Job Number", Value: getVal('cov_job') },
            { Property: "Site Contact Name", Value: getVal('cov_site_contact_name') },
            { Property: "Site Contact Phone", Value: getVal('cov_site_contact_phone') },
            { Property: "Site Contact Email", Value: getVal('cov_site_contact_email') },
            { Property: "Site Address 1", Value: getVal('cov_site_address_1') },
            { Property: "Site Address 2", Value: getVal('cov_site_address_2') },
            { Property: "Site City", Value: getVal('cov_site_city') },
            { Property: "Site State", Value: getVal('cov_site_state') },

            { Property: "Site Zip", Value: getVal('cov_site_zip') },
            { Property: "Office Contact Name", Value: getVal('cov_office_contact_name') },
            { Property: "Office Contact Phone", Value: getVal('cov_office_contact_phone') },
            { Property: "Office Contact Email", Value: getVal('cov_office_contact_email') },
            { Property: "Office Address 1", Value: getVal('cov_office_address_1') },
            { Property: "Office Address 2", Value: getVal('cov_office_address_2') },
            { Property: "Office City", Value: getVal('cov_office_city') },
            { Property: "Office State", Value: getVal('cov_office_state') },
            { Property: "Office Zip", Value: getVal('cov_office_zip') },
            { Property: "Contractor", Value: getVal('cov_contractor') },
            { Property: "Rig Type", Value: getVal('cov_equipment') },
            { Property: "Hammer System", Value: getVal('cov_hammer') },
            { Property: "Sampler Set", Value: getVal('cov_sampler') },
            { Property: "Groundwater Depth (ft)", Value: getVal('cov_gw_depth') },
            { Property: "Main Form Comments", Value: getVal('global_comments') }
        ];
        
        // Prepare Burmister dataset for export
        const datasetBurmister = datasetProfiles.map(p => ({
            "Layer ID": p["Layer ID"] || p["Sample ID"],
            "Top Depth (ft)": Number(p["Top Depth (ft)"]).toFixed(1),
            "Bottom Depth (ft)": Number(p["Bottom Depth (ft)"]).toFixed(1),
            "Full Layer Description": generateBurmisterDescription(p)
        }));

        // Pass complete structural parameters down into sheets builder
        addStyledSheet(workbook, "Cover Page", coverData);
        addStyledSheet(workbook, "Profiles", datasetProfiles);
        addStyledSheet(workbook, "Boring Info", datasetRuns);
        addStyledSheet(workbook, "Full Layer Description", datasetBurmister);
        addStyledSheet(workbook, "Soil Types (Reference)", referenceSoilTypes);

        const filename = (getVal('cov_project') || "Project") + "_Calculated_Export.xlsx";

        // Generate workbook binary, wrap as blob stream asset, and trigger download hook
        workbook.xlsx.writeBuffer().then(function(buffer) {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = filename;
            document.body.appendChild(anchor);
            anchor.click();
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(anchor);
            }, 100);
        });
    });

    // Run baseline initialization loops on system load
    populateSampleDropdown();
    renderProfilesTable();
    renderRunsTable();
    calculateGeotechOutputs();
    renderBurmisterTable();

    // Set Default Job Information values
    window.addEventListener('DOMContentLoaded', () => {
        const defaults = {
            'cov_date': '2026-05-30',
            'cov_project': 'Tech Campus Expansion',
            'cov_job': '2026-HQ-01',
            'cov_site_contact_name': 'Jane Doe',
            'cov_site_contact_phone': '(555) 123-4567',
            'cov_site_contact_email': 'jane@techcampus.com',
            'cov_site_address_1': '100 Innovation Way',
            'cov_site_address_2': 'Building B, Suite 100',
            'cov_site_city': 'Austin',
            'cov_site_state': 'TX',
            'cov_site_zip': '78701',
            'cov_office_contact_name': 'John Smith',
            'cov_office_contact_phone': '(555) 987-6543',
            'cov_office_contact_email': 'john.smith@geoeng.com',
            'cov_office_address_1': '400 Geo Center',
            'cov_office_address_2': 'Floor 2',
            'cov_office_city': 'Houston',
            'cov_office_state': 'TX',
            'cov_office_zip': '77002'
        };

        for (let id in defaults) {
            let el = document.getElementById(id);
            if (el) {
                // If it's a select, we may need to add the option if it doesn't exist
                if (el.tagName === 'SELECT') {
                    let exists = Array.from(el.options).some(opt => opt.value === defaults[id]);
                    if (!exists) {
                        let opt = document.createElement('option');
                        opt.value = defaults[id];
                        opt.text = defaults[id];
                        el.add(opt);
                    }
                }
                el.value = defaults[id];
            }
        }
    });


    function renderPresentationLog() {
        const container = document.getElementById('presentationLogContainer');
        if (!container) return;
        
        let borings = {};
        
        datasetRuns.forEach(r => {
            let bId = r["Boring ID"];
            if (!borings[bId]) borings[bId] = [];
            borings[bId].push({...r});
        });

        let layersBySample = {};
        datasetProfiles.forEach(layer => {
            let sId = layer["Sample ID"];
            if (!layersBySample[sId]) layersBySample[sId] = [];
            layersBySample[sId].push({...layer});
        });

        let html = '';
        let boringIds = Object.keys(borings).sort();
        
        boringIds.forEach(bId => {
            let runs = borings[bId];
            runs.sort((a, b) => a["Start Depth (ft)"] - b["Start Depth (ft)"]);
            
            let runsHtml = '';
            runs.forEach(run => {
                let sampleFullId = run["Sample ID"];
                if (!sampleFullId.startsWith(run["Boring ID"])) {
                    sampleFullId = run["Boring ID"] + sampleFullId;
                }
                
                let startDepth = run["Start Depth (ft)"];
                let endDepth = run["End Depth (ft)"];
                let nVal = run["SPT N-Value"];
                let rec = run["Recovery (in)"];
                
                let layers = layersBySample[sampleFullId] || [];
                layers.sort((a, b) => a["Top Depth (ft)"] - b["Top Depth (ft)"]);
                
                let layersHtml = '';
                layers.forEach(layer => {
                    let desc = generateBurmisterDescription(layer);
                    let soilClass = getSoilGraphicClass(layer["Soil Type"]);
                    layersHtml += `
                        <div style="display: flex; border-top: 1px solid #e2e8f0;">
                            <div class="${soilClass}" style="width: 24px; border-right: 1px solid #e2e8f0;"></div>
                            <div style="padding: 0.5rem 1rem; flex: 1;">
                                <div style="font-size: 0.8rem; font-weight: bold; color: var(--blue-700);">${Number(layer["Top Depth (ft)"]).toFixed(1)}' - ${Number(layer["Bottom Depth (ft)"]).toFixed(1)}'</div>
                                <div style="font-size: 0.9rem; color: var(--slate-800);">${desc}</div>
                            </div>
                        </div>
                    `;
                });
                
                if (layers.length === 0) {
                    layersHtml = `<div style="padding: 0.5rem 1rem; color: #94a3b8; font-style: italic; font-size: 0.85rem; border-top: 1px solid #e2e8f0;">No layers defined for this sample</div>`;
                }
                
                runsHtml += `
                    <div style="margin-bottom: 1rem; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; background: white;">
                        <div style="background: #f1f5f9; padding: 0.5rem 1rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #cbd5e1;">
                            <strong style="color: var(--slate-800);">${sampleFullId} (${startDepth.toFixed(1)}' - ${endDepth.toFixed(1)}')</strong>
                            <div style="font-size: 0.85rem; color: var(--slate-600); display: flex; gap: 1rem;">
                                <span>N-Value: <strong style="color: var(--slate-800);">${nVal}</strong></span>
                                <span>Recovery: <strong style="color: var(--slate-800);">${rec}"</strong></span>
                            </div>
                        </div>
                        ${layersHtml}
                    </div>
                `;
            });
            
            html += `
                <div style="margin-bottom: 2rem; background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
                    <h3 style="margin-top: 0; margin-bottom: 1rem; font-size: 1.25rem; color: var(--slate-800); border-bottom: 2px solid var(--blue-600); padding-bottom: 0.5rem; display: inline-block;">Boring: ${bId}</h3>
                    <div style="padding-left: 0.5rem;">
                        ${runsHtml || '<p style="color: #94a3b8; font-style: italic;">No samples recorded</p>'}
                    </div>
                </div>
            `;
        });
        
        if (boringIds.length === 0) {
            html = '<p style="color: #64748b; font-style: italic; width: 100%; text-align: center;">No presentation data available.</p>';
        }
        
        container.innerHTML = html;
    }
