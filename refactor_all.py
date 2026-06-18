import re

file_path = 'c:\\Users\\marki\\OneDrive\\Desktop\\BoringLogWebApp\\index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

fields_to_convert = [
    'layer_override_contractor',
    'layer_override_equipment',
    'layer_override_hammer',
    'layer_override_sampler',
    'layer_override_foreman',
    'layer_override_helper',
    'layer_override_bit_type',
    'layer_override_rod_type',
    'layer_override_casing',
    'layer_override_casing_lining',
    'layer_override_case_diameter',
    'layer_override_hammer_wgt',
    'layer_override_hammer_drop',
    'layer_override_rock_hammer_type',
    'layer_override_rock_hammer_wgt_drop',
    'layer_override_rock_size',
    'rel_layer_id',
    'rel_top',
    'rel_bottom',
    'rel_color',
    'rel_primary_size',
    'rel_soil',
    'rel_minor_1',
    'rel_minor_2',
    'rel_minor_3',
    'rel_moisture'
]

def replace_select(match):
    full_match = match.group(0)
    id_val = match.group(1)
    if id_val not in fields_to_convert:
        return full_match
    
    options_block = match.group(3)
    options = re.findall(r'<option[^>]*value="([^"]*)"[^>]*>.*?</option>', options_block, re.IGNORECASE)
    
    if 'width: 50%' in full_match:
        input_style = 'width: 50%; font-size: 0.85rem; padding: 0.35rem; border: 1px solid var(--border); border-radius: 4px;'
    else:
        input_style = 'flex: 1; min-width: 0; padding: 0.35rem; font-size: 0.85rem; border: 1px solid var(--border); border-radius: 4px;'

    if id_val in ['rel_minor_1', 'rel_minor_2', 'rel_minor_3']:
        new_input = f'<input type="text" id="{id_val}" list="rel_soil_list" placeholder="Select or type..." autocomplete="off" style="{input_style}" onclick="this.setAttribute(\'data-val\', this.value); this.value=\'\';" onblur="if(this.value==\'\') this.value=this.getAttribute(\'data-val\');">'
    else:
        datalist_options = []
        for val in options:
            datalist_options.append(f'                                    <option value="{val}">')
        new_input = f'<input type="text" id="{id_val}" list="{id_val}_list" placeholder="Select or type..." autocomplete="off" style="{input_style}" onclick="this.setAttribute(\'data-val\', this.value); this.value=\'\';" onblur="if(this.value==\'\') this.value=this.getAttribute(\'data-val\');">\n<datalist id="{id_val}_list">\n' + '\n'.join(datalist_options) + f'\n</datalist>'
    
    indent = re.match(r'^\s*', full_match).group(0)
    lines = new_input.split('\n')
    indented_lines = [lines[0]] + [(indent + l if l.strip() else l) for l in lines[1:]]
    return '\n'.join(indented_lines)

select_regex = re.compile(r'<select\s+id="([a-zA-Z0-9_]+)"([^>]*)>(.*?)</select>', re.DOTALL | re.IGNORECASE)

new_content = select_regex.sub(replace_select, content)

for field in fields_to_convert:
    btn_regex = re.compile(r'\s*<button[^>]*onclick="promptAddChoice\(\'' + field + r'\'\)"[^>]*>.*?</button>', re.DOTALL | re.IGNORECASE)
    new_content = btn_regex.sub('', new_content)

with open('c:\\Users\\marki\\OneDrive\\Desktop\\BoringLogWebApp\\index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
print('Done!')
