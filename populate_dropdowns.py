import re

def process_select(match):
    select_start = match.group(1)
    select_inner = match.group(2)
    select_end = match.group(3)
    
    # Check if there are options with non-empty values
    options = re.findall(r'<option[^>]*value="([^"]*)"[^>]*>(.*?)</option>', select_inner)
    valid_options = [opt for opt in options if opt[0] != '']
    
    new_inner = select_inner
    if not valid_options:
        # Create a sample data option
        # Extract the placeholder text if any
        placeholder_match = re.search(r'<option[^>]*value=""[^>]*>Select (.*?)(?:\.{3,})?</option>', select_inner, re.IGNORECASE)
        sample_text = "Sample " + placeholder_match.group(1).replace("...", "") if placeholder_match else "Sample Data"
        
        # Insert the sample option before </select> doesn't apply here because we are modifying inner
        # We append to new_inner
        sample_opt = f'\n                            <option value="{sample_text}" selected>{sample_text}</option>'
        new_inner = new_inner + sample_opt
    else:
        # Ensure at least one valid option has "selected"
        if 'selected' not in new_inner:
            # Add selected to the first valid option
            first_val = valid_options[0][0]
            # Replace the first occurrence of this option to have 'selected'
            new_inner = re.sub(rf'(<option[^>]*value="{re.escape(first_val)}"[^>]*)>', r'\1 selected>', new_inner, count=1)
            
    return select_start + new_inner + select_end

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

new_html = re.sub(r'(<select[^>]*>)(.*?)(</select>)', process_select, html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)
