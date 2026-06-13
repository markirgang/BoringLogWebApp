import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add rel_boring_id to Tab 3
old_sample_target = '''                <div class="form-group">
                    <label>Sample Target Reference</label>
                    <div class="input-addon-group">
                        <select id="rel_sample_id">'''
new_boring_target = '''                <div class="form-group">
                    <label>Boring Target Reference</label>
                    <div class="input-addon-group">
                        <select id="rel_boring_id">
                        </select>
                        <button type="button" class="btn-small" onclick="promptAddChoice('rel_boring_id')">➕ Choice</button>
                    </div>
                </div>
                <div class="form-group">
                    <label>Sample Target Reference</label>
                    <div class="input-addon-group">
                        <select id="rel_sample_id">'''
content = content.replace(old_sample_target, new_boring_target)

# 2. Revert buttons
old_buttons = '''                <div class="form-group" style="justify-content: flex-end; display: flex; gap: 0.5rem;">
                    <button type="submit" class="btn btn-primary">➕ Log Layer to Sample</button>
                    <button type="button" class="btn btn-success" onclick="addNewLayerRecord()">➕ Add a new layer record to the sample</button>
                </div>'''
new_buttons = '''                <div class="form-group" style="justify-content: flex-end;">
                    <button type="submit" class="btn btn-primary">➕ Log Layer to Sample</button>
                </div>'''
content = content.replace(old_buttons, new_buttons)

# 3. Rewrite populateSampleDropdown
old_pop = '''    function populateSampleDropdown() {
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
    }'''

new_pop = '''    function populateSampleDropdown() {
        const selectElement = document.getElementById('rel_boring_id');
        if (!selectElement) return;
        
        const currentSelection = selectElement.value;
        selectElement.innerHTML = '';
        
        const boringIds = [...new Set(datasetRuns.map(r => r["Boring ID"]))];
        
        boringIds.forEach(id => {
            const opt = document.createElement('option');
            opt.value = id;
            opt.text = id;
            selectElement.add(opt);
        });
        
        if (boringIds.includes(currentSelection)) {
            selectElement.value = currentSelection;
        } else if (boringIds.length > 0) {
            selectElement.value = boringIds[0];
        }
    }'''
content = content.replace(old_pop, new_pop)

# 4. Remove addNewLayerRecord function entirely
# We'll use regex to remove from 'function addNewLayerRecord()' to 'document.getElementById('runForm').addEventListener('submit', function(e) {'
content = re.sub(r'    function addNewLayerRecord\(\).*?(?=    document\.getElementById\(\'runForm\'\))', '', content, flags=re.DOTALL)

# 5. Update sampleLayerForm submit
old_submit = '''    document.getElementById('sampleLayerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        let sampleId = document.getElementById('rel_sample_id').value;
        let layerNum = document.getElementById('rel_layer_id').value;
        if (!sampleId || !layerNum) return;
        let layerId = sampleId + layerNum;

        let existingIndex = datasetProfiles.findIndex(p => p["Layer ID"] === layerId);
        if (existingIndex !== -1) {
            datasetProfiles.splice(existingIndex, 1);
        }

        datasetProfiles.push({
            "Sample ID": sampleId,
            "Layer ID": layerId,'''

new_submit = '''    document.getElementById('sampleLayerForm').addEventListener('submit', function(e) {
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
            "Layer ID": layerId,'''
content = content.replace(old_submit, new_submit)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done!')
