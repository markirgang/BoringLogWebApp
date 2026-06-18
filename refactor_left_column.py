import re

file_path = 'c:\\Users\\marki\\OneDrive\\Desktop\\BoringLogWebApp\\index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

fields_to_convert = [
    'run_contractor',
    'run_equipment',
    'run_hammer',
    'run_sampler',
    'run_foreman',
    'run_helper',
    'run_bit_type',
    'run_rod_type',
    'run_casing',
    'run_casing_lining',
    'run_case_diameter',
    'run_hammer_wgt',
    'run_hammer_drop',
    'run_rock_hammer_type',
    'run_rock_hammer_wgt_drop',
    'run_rock_size'
]

def replace_select(match):
    full_match = match.group(0)
    id_val = match.group(1)
    if id_val not in fields_to_convert:
        return full_match
    
    options_block = match.group(3)
    options = re.findall(r'<option[^>]*value="([^"]*)"[^>]*>.*?</option>', options_block, re.IGNORECASE)
    
    # Try to extract the original style to reuse, or use a default
    style_match = re.search(r'style="([^"]+)"', full_match)
    if style_match:
        base_style = style_match.group(1)
    else:
        base_style = "font-size: 0.8rem; padding: 0.35rem;"
    
    # Ensure it takes full width of its container if it was a select
    input_style = base_style + "; width: 100%; box-sizing: border-box; border: 1px solid var(--border); border-radius: 4px;"

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

with open('c:\\Users\\marki\\OneDrive\\Desktop\\BoringLogWebApp\\index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
print('Done refactoring left column!')
