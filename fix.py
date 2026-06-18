import sys
content = open('index.html', 'r', encoding='utf-8').read()

target = '''                document.getElementById('rel_pid').value = layer["PID (ppm)"] !== undefined ? layer["PID (ppm)"] : 0.0;
                document.getElementById('rel_pp').value = layer["Pocket Penetrometer (tsf)"] !== undefined ? layer["Pocket Penetrometer (tsf)"] : 0.0;
                document.getElementById('rel_tv').value = layer["Pocket Torvane (tsf)"] !== undefined ? layer["Pocket Torvane (tsf)"] : 0.0;
                
                updateSoilPreview(layer["Soil Type"]);
                updateLayerLengthUI();
            }
        } else {
            // Reset layer fields to defaults if no layer is associated (editing a run without layers)
            const resetVal = (id, val) => {
                let el = document.getElementById(id);
                if (el) el.value = val;
            };
            resetVal('rel_layer_id', 'L-1');
            resetVal('rel_top', '0.0');
            resetVal('rel_bottom', '0.5');
            resetVal('rel_color', '');
            resetVal('rel_primary_size', '');
            resetVal('rel_soil', 'TOPSOIL');
            resetVal('rel_minor_1', '');
            resetVal('rel_minor_2', '');
            resetVal('rel_minor_3', '');
            resetVal('rel_moisture', '');
            if (document.getElementById('rel_comments')) resetVal('rel_comments', '');
            resetVal('rel_pid', '0.0');
            resetVal('rel_pp', '0.0');
            resetVal('rel_tv', '0.0');'''

replacement = '''                document.getElementById('rel_pid').value = layer["PID (ppm)"] !== undefined ? layer["PID (ppm)"] : 0.0;
                document.getElementById('rel_pp').value = layer["Pocket Penetrometer (tsf)"] !== undefined ? layer["Pocket Penetrometer (tsf)"] : 0.0;
                document.getElementById('rel_tv').value = layer["Pocket Torvane (tsf)"] !== undefined ? layer["Pocket Torvane (tsf)"] : 0.0;
                
                const overrideMap = {
                    'layer_override_contractor': 'Drilling Contractor',
                    'layer_override_equipment': 'Drilling Equipment Rig',
                    'layer_override_hammer': 'Hammer Configuration Type',
                    'layer_override_sampler': 'Sampler Setup',
                    'layer_override_foreman': 'Foreman',
                    'layer_override_helper': 'Helper',
                    'layer_override_bit_type': 'Bit Type',
                    'layer_override_rod_type': 'Rod Type',
                    'layer_override_casing': 'Casing',
                    'layer_override_casing_lining': 'Casing Lining',
                    'layer_override_case_diameter': 'Case Diameter',
                    'layer_override_hammer_wgt': 'Hammer Wgt',
                    'layer_override_hammer_drop': 'Hammer Drop',
                    'layer_override_rock_hammer_type': 'Rock Hammer Type',
                    'layer_override_rock_hammer_wgt_drop': 'Rock Hammer Wgt/Drop',
                    'layer_override_rock_size': 'Rock Size'
                };
                for (let id in overrideMap) {
                    let key = overrideMap[id];
                    if (layer[key] !== undefined) {
                        setSelectVal(id, layer[key]);
                    }
                }
                
                updateSoilPreview(layer["Soil Type"]);
                updateLayerLengthUI();
            }
        } else {
            // Reset layer fields to defaults if no layer is associated (editing a run without layers)
            const resetVal = (id, val) => {
                let el = document.getElementById(id);
                if (el) el.value = val;
            };
            resetVal('rel_layer_id', 'L-1');
            resetVal('rel_top', '0.0');
            resetVal('rel_bottom', '0.5');
            resetVal('rel_color', '');
            resetVal('rel_primary_size', '');
            resetVal('rel_soil', 'TOPSOIL');
            resetVal('rel_minor_1', '');
            resetVal('rel_minor_2', '');
            resetVal('rel_minor_3', '');
            resetVal('rel_moisture', '');
            if (document.getElementById('rel_comments')) resetVal('rel_comments', '');
            resetVal('rel_pid', '0.0');
            resetVal('rel_pp', '0.0');
            resetVal('rel_tv', '0.0');
            
            const mappings = [
                ['run_contractor', 'layer_override_contractor'],
                ['run_equipment', 'layer_override_equipment'],
                ['run_hammer', 'layer_override_hammer'],
                ['run_sampler', 'layer_override_sampler'],
                ['run_foreman', 'layer_override_foreman'],
                ['run_helper', 'layer_override_helper'],
                ['run_bit_type', 'layer_override_bit_type'],
                ['run_rod_type', 'layer_override_rod_type'],
                ['run_casing', 'layer_override_casing'],
                ['run_casing_lining', 'layer_override_casing_lining'],
                ['run_case_diameter', 'layer_override_case_diameter'],
                ['run_hammer_wgt', 'layer_override_hammer_wgt'],
                ['run_hammer_drop', 'layer_override_hammer_drop'],
                ['run_rock_hammer_type', 'layer_override_rock_hammer_type'],
                ['run_rock_hammer_wgt_drop', 'layer_override_rock_hammer_wgt_drop'],
                ['run_rock_size', 'layer_override_rock_size']
            ];
            mappings.forEach(([bId, lId]) => {
                const bEl = document.getElementById(bId);
                const lEl = document.getElementById(lId);
                if (bEl && lEl) lEl.value = bEl.value;
            });'''

if target in content:
    content = content.replace(target, replacement)
    open('index.html', 'w', encoding='utf-8').write(content)
    print('SUCCESS')
else:
    print('TARGET NOT FOUND')
