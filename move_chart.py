import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove from tab 6
tab6_block = '''        <div style="margin-bottom: 2rem; max-width: 800px; background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0;">Boring vs. Estimated Bearing Capacity</h3>
            <canvas id="bearingChart" width="400" height="200"></canvas>
        </div>
        '''
content = content.replace(tab6_block, '')

# 2. Insert into tab 5
tab5_target = '''    <div id="tab-calcs" class="tab-content">
        <h3>Estimated Bearing Capacity by Boring</h3>
        <p>Calculated using empirical correlation: <strong>q<sub>a</sub> &approx; N / 4</strong> (where N is the harmonic mean SPT N-Value)</p>
        
        <div style="background:#dbeafe; padding:1rem; border:1px solid #93c5fd; border-radius:6px; margin-bottom: 1.5rem;">
            <h4 style="margin:0 0 0.5rem 0; color:#1e40af;">Site-Wide Average Bearing Capacity</h4>
            <p style="font-size:1.5rem; font-weight:bold; margin:0; color:#1e3a8a;" id="overallAverageCapacity">-- ksf</p>
            <small style="color:#3b82f6;">Arithmetic mean of all calculated boring capacities.</small>
        </div>'''

tab5_replacement = '''    <div id="tab-calcs" class="tab-content">
        <h3>Estimated Bearing Capacity by Boring</h3>
        <p>Calculated using empirical correlation: <strong>q<sub>a</sub> &approx; N / 4</strong> (where N is the harmonic mean SPT N-Value)</p>
        
        <div style="margin-bottom: 2rem; max-width: 800px; background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0;">Boring vs. Estimated Bearing Capacity</h3>
            <canvas id="bearingChart" width="400" height="200"></canvas>
        </div>
        
        <div style="background:#dbeafe; padding:1rem; border:1px solid #93c5fd; border-radius:6px; margin-bottom: 1.5rem;">
            <h4 style="margin:0 0 0.5rem 0; color:#1e40af;">Site-Wide Average Bearing Capacity</h4>
            <p style="font-size:1.5rem; font-weight:bold; margin:0; color:#1e3a8a;" id="overallAverageCapacity">-- ksf</p>
            <small style="color:#3b82f6;">Arithmetic mean of all calculated boring capacities.</small>
        </div>'''
        
content = content.replace(tab5_target, tab5_replacement)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
