import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Change Tab 6 name
content = content.replace('📖 6. Soil Types', '📖 6. Soil Reference Types')

# 2. Add date to Tab 1 (coverForm)
old_cov_form = '''                <div class="form-group">
                    <label>Log Reference number</label>
                    <input type="text" id="cov_boring_id" value="B1" placeholder="Enter log reference...">
                </div>'''
new_cov_form = '''                <div class="form-group">
                    <label>Log Reference number</label>
                    <input type="text" id="cov_boring_id" value="B1" placeholder="Enter log reference...">
                </div>
                <div class="form-group">
                    <label>Date</label>
                    <input type="date" id="cov_date">
                </div>'''
content = content.replace(old_cov_form, new_cov_form)

# 3. Add date to Tab 2 (runForm)
old_run_form = '''                <div class="form-group">
                    <label>Sample Target Reference</label>
                    <div class="input-addon-group">
                        <select id="run_id">'''
new_run_form = '''                <div class="form-group">
                    <label>Date</label>
                    <input type="date" id="run_date">
                </div>
                <div class="form-group">
                    <label>Sample Target Reference</label>
                    <div class="input-addon-group">
                        <select id="run_id">'''
content = content.replace(old_run_form, new_run_form)

# 4. Add Date to coverData array
old_coverData = '''        const coverData = [
            { Property: "Log Reference number", Value: document.getElementById('cov_boring_id').value },'''
new_coverData = '''        const coverData = [
            { Property: "Log Reference number", Value: document.getElementById('cov_boring_id').value },
            { Property: "Date", Value: document.getElementById('cov_date').value },'''
content = content.replace(old_coverData, new_coverData)

# 5. Add Date to datasetRuns array
old_datasetRuns = '''    let datasetRuns = [
        { "Boring ID": "B1", "Sample ID": "B1S1", "Start Depth (ft)": 0.0, "End Depth (ft)": 2.0, "SPT N-Value": 6, "Recovery (in)": 18, "Field Testing Notes": "PID: 0.0 ppm", "Comments": "Initial baseline standard check run" },
        { "Boring ID": "B1", "Sample ID": "B1S2", "Start Depth (ft)": 2.0, "End Depth (ft)": 4.0, "SPT N-Value": 8, "Recovery (in)": 16, "Field Testing Notes": "PID: 0.2 ppm", "Comments": "" },
        { "Boring ID": "B1", "Sample ID": "B1S3", "Start Depth (ft)": 4.0, "End Depth (ft)": 6.0, "SPT N-Value": 14, "Recovery (in)": 22, "Field Testing Notes": "PID: 0.0 ppm", "Comments": "" }
    ];'''
new_datasetRuns = '''    let datasetRuns = [
        { "Boring ID": "B1", "Date": "", "Sample ID": "B1S1", "Start Depth (ft)": 0.0, "End Depth (ft)": 2.0, "SPT N-Value": 6, "Recovery (in)": 18, "Field Testing Notes": "PID: 0.0 ppm", "Comments": "Initial baseline standard check run" },
        { "Boring ID": "B1", "Date": "", "Sample ID": "B1S2", "Start Depth (ft)": 2.0, "End Depth (ft)": 4.0, "SPT N-Value": 8, "Recovery (in)": 16, "Field Testing Notes": "PID: 0.2 ppm", "Comments": "" },
        { "Boring ID": "B1", "Date": "", "Sample ID": "B1S3", "Start Depth (ft)": 4.0, "End Depth (ft)": 6.0, "SPT N-Value": 14, "Recovery (in)": 22, "Field Testing Notes": "PID: 0.0 ppm", "Comments": "" }
    ];'''
content = content.replace(old_datasetRuns, new_datasetRuns)

# 6. Add Date to run table headers
old_th = '''                        <th>Boring ID</th>
                        <th>Sample ID</th>'''
new_th = '''                        <th>Boring ID</th>
                        <th>Date</th>
                        <th>Sample ID</th>'''
content = content.replace(old_th, new_th)

# 7. Add Date to renderRunsTable
old_td = '''                <td>${r["Boring ID"]}</td>
                <td>${r["Sample ID"]}</td>'''
new_td = '''                <td>${r["Boring ID"]}</td>
                <td>${r["Date"] || ''}</td>
                <td>${r["Sample ID"]}</td>'''
content = content.replace(old_td, new_td)

# 8. Add Date to runForm submit listener
old_submit = '''        datasetRuns.push({
            "Boring ID": boringRaw,
            "Sample ID": newSampleId,'''
new_submit = '''        datasetRuns.push({
            "Boring ID": boringRaw,
            "Date": document.getElementById('run_date').value,
            "Sample ID": newSampleId,'''
content = content.replace(old_submit, new_submit)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done!")
