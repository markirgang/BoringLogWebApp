import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace B-1 with B1, S-1 with S1, etc.
content = re.sub(r'\b([BS])-(\d+)\b', r'\1\2', content)

old_runForm = '''        let boringRaw = document.getElementById('run_boring_id').value;
        let sampleRaw = document.getElementById('run_id').value;
        let formattedBoring = boringRaw.replace(/-/g, '');
        let formattedSample = sampleRaw.replace(/-/g, '');
        let newSampleId = formattedBoring + formattedSample;'''

new_runForm = '''        let boringRaw = document.getElementById('run_boring_id').value;
        let sampleRaw = document.getElementById('run_id').value;
        let newSampleId = boringRaw + sampleRaw;
        
        let existingIndex = datasetRuns.findIndex(r => r["Sample ID"] === newSampleId);
        if (existingIndex !== -1) {
            datasetRuns.splice(existingIndex, 1);
        }'''
content = content.replace(old_runForm, new_runForm)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
