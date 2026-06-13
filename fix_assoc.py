import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update datasetProfiles to use B1S1 instead of S1
old_profiles = '''    let datasetProfiles = [
        { "Sample ID": "S1", "Layer ID": "S1L1", "Top Depth (ft)": 0.0, "Bottom Depth (ft)": 0.5, "Soil Type": "ASPHALT", "Moisture Condition": "dry", "Comments": "Fresh overlay" },
        { "Sample ID": "S1", "Layer ID": "S1L2", "Top Depth (ft)": 0.5, "Bottom Depth (ft)": 1.0, "Soil Type": "BASE COURSE", "Moisture Condition": "damp", "Comments": "" },
        { "Sample ID": "S2", "Layer ID": "S2L1", "Top Depth (ft)": 1.0, "Bottom Depth (ft)": 4.0, "Soil Type": "FILL/REWORKED", "Moisture Condition": "moist", "Comments": "Heavy structural compaction observed" }
    ];'''
    
new_profiles = '''    let datasetProfiles = [
        { "Sample ID": "B1S1", "Layer ID": "B1S1L1", "Top Depth (ft)": 0.0, "Bottom Depth (ft)": 0.5, "Soil Type": "ASPHALT", "Moisture Condition": "dry", "Comments": "Fresh overlay" },
        { "Sample ID": "B1S1", "Layer ID": "B1S1L2", "Top Depth (ft)": 0.5, "Bottom Depth (ft)": 1.0, "Soil Type": "BASE COURSE", "Moisture Condition": "damp", "Comments": "" },
        { "Sample ID": "B1S2", "Layer ID": "B1S2L1", "Top Depth (ft)": 1.0, "Bottom Depth (ft)": 4.0, "Soil Type": "FILL/REWORKED", "Moisture Condition": "moist", "Comments": "Heavy structural compaction observed" }
    ];'''
content = content.replace(old_profiles, new_profiles)

# 2. Add populateSampleDropdown() definition
func_def = '''    function populateSampleDropdown() {
        const selectElement = document.getElementById('rel_sample_id');
        if (!selectElement) return;
        
        const currentSelection = selectElement.value;
        selectElement.innerHTML = '';
        
        const sampleIds = [...new Set(datasetRuns.map(r => r["Sample ID"]))];
        
        sampleIds.forEach(id => {
            const opt = document.createElement('option');
            opt.value = id;
            opt.text = id;
            selectElement.add(opt);
        });
        
        if (sampleIds.includes(currentSelection)) {
            selectElement.value = currentSelection;
        } else if (sampleIds.length > 0) {
            selectElement.value = sampleIds[0];
        }
    }
'''

# We will inject it before the runForm event listener
target = "document.getElementById('runForm').addEventListener('submit', function(e) {"
content = content.replace(target, func_def + "\n    " + target)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
