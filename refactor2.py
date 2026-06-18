import re

file_path = 'c:\\Users\\marki\\OneDrive\\Desktop\\BoringLogWebApp\\index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

fields_to_convert = ['rel_color', 'rel_primary_size']

def replace_select(match):
    full_match = match.group(0)
    id_val = match.group(1)
    if id_val not in fields_to_convert:
        return full_match
    
    options_block = match.group(3)
    options = re.findall(r'<option\s+value="([^"]*)"[^>]*>(.*?)</option>', options_block)
    
    datalist_options = []
    for val, text in options:
        datalist_options.append(f'                                    <option value="{val}">')
    
    input_style = 'flex: 1; min-width: 0; padding: 0.35rem; font-size: 0.85rem; border: 1px solid var(--border); border-radius: 4px;'

    new_input = f'<input type="text" id="{id_val}" list="{id_val}_list" placeholder="Select or type..." autocomplete="off" style="{input_style}" onclick="this.setAttribute(\'data-val\', this.value); this.value=\'\';" onblur="if(this.value==\'\') this.value=this.getAttribute(\'data-val\');">\n<datalist id="{id_val}_list">\n' + '\n'.join(datalist_options) + f'\n</datalist>'
    
    indent = re.match(r'^\s*', full_match).group(0)
    lines = new_input.split('\n')
    indented_lines = [lines[0]] + [(indent + l if l.strip() else l) for l in lines[1:]]
    return '\n'.join(indented_lines)

select_regex = re.compile(r'<select\s+id="([a-zA-Z0-9_]+)"(?:.*?style="([^"]+)")?[^>]*>(.*?)</select>', re.DOTALL | re.IGNORECASE)

new_content = select_regex.sub(replace_select, content)

for field in fields_to_convert:
    btn_regex = re.compile(r'\s*<button[^>]*onclick="promptAddChoice\(\'' + field + r'\'\)"[^>]*>.*?</button>', re.DOTALL | re.IGNORECASE)
    new_content = btn_regex.sub('', new_content)

with open('c:\\Users\\marki\\OneDrive\\Desktop\\BoringLogWebApp\\index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
print('Done!')
