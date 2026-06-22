import re

# Read index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Extract the Column 3 (Layer Description Burmister card) from Tab 2.
# It starts around: <!-- COLUMN 3: LAYER DESCRIPTION (BURMISTER) -->
# and ends right before: <!-- ERROR MESSAGE CONTAINER -->
start_marker = '<!-- COLUMN 3: LAYER DESCRIPTION (BURMISTER) -->'
end_marker = '<!-- ERROR MESSAGE CONTAINER -->'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Error: Could not find Column 3 markers!")
    exit(1)

# Extract Column 3 block
col3_block = content[start_idx:end_idx].strip()

# Remove col3_block from content
content = content[:start_idx] + "\\n                \\n" + content[end_idx:]

# Also adjust Tab 2 grid layout wrapper to be a single-column layout centered at max-width: 600px
old_tab2_grid = '<div class="boring-info-grid" style="display: grid; grid-template-columns: 1fr 1.25fr; gap: 1.5rem; margin-bottom: 1.5rem; align-items: start;">'
new_tab2_grid = '<div class="boring-info-grid" style="max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">'
content = content.replace(old_tab2_grid, new_tab2_grid)

# 2. Modify the extracted Layer Description card to include the Constituents subform and Tab 3 error container
# First, replace 'Minor Components (Qualifier & Material)' title and its inputs with the new Constituents subform
old_minor_block = """                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 0.75rem; border-radius: 6px; display: flex; flex-direction: column; gap: 0.5rem;">
                        <span style="font-size: 0.8rem; font-weight: bold; color: var(--slate-700);">Minor Components (Qualifier & Material)</span>
                        
                        <div class="form-group">
                            <label style="font-size: 0.75rem;">Minor 1 (some 20-35%)</label>
                            <div class="input-addon-group">
                                <input type="text" id="rel_minor_1" list="rel_soil_list" onfocus="this.dataset.val=this.value; this.placeholder=this.value; this.value='';" onblur="if(this.value==='') this.value=this.dataset.val; this.placeholder='';" placeholder="" autocomplete="off" style="flex: 1; min-width: 0; padding: 0.35rem; font-size: 0.85rem; border: 1px solid var(--border); border-radius: 4px;" >
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label style="font-size: 0.75rem;">Minor 2 (little 10-20%)</label>
                            <div class="input-addon-group">
                                <input type="text" id="rel_minor_2" list="rel_soil_list" onfocus="this.dataset.val=this.value; this.placeholder=this.value; this.value='';" onblur="if(this.value==='') this.value=this.dataset.val; this.placeholder='';" placeholder="" autocomplete="off" style="flex: 1; min-width: 0; padding: 0.35rem; font-size: 0.85rem; border: 1px solid var(--border); border-radius: 4px;" >
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label style="font-size: 0.75rem;">Minor 3 (trace 1-10%)</label>
                            <div class="input-addon-group">
                                <input type="text" id="rel_minor_3" list="rel_soil_list" onfocus="this.dataset.val=this.value; this.placeholder=this.value; this.value='';" onblur="if(this.value==='') this.value=this.dataset.val; this.placeholder='';" placeholder="" autocomplete="off" style="flex: 1; min-width: 0; padding: 0.35rem; font-size: 0.85rem; border: 1px solid var(--border); border-radius: 4px;" >
                            </div>
                        </div>
                    </div>"""

new_minor_block = """                    <!-- Constituents Section -->
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 0.75rem; border-radius: 6px; display: flex; flex-direction: column; gap: 0.5rem;">
                        <span style="font-size: 0.8rem; font-weight: bold; color: var(--slate-700);">Constituents</span>
                        
                        <!-- Dropdowns for adding a constituent -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label style="font-size: 0.75rem;">Qualifier</label>
                                <select id="constituent_qualifier" style="font-size: 0.8rem; padding: 0.35rem; width: 100%; border: 1px solid var(--border); border-radius: 4px;">
                                    <option value="some">some (20-35%)</option>
                                    <option value="little">little (10-20%)</option>
                                    <option value="trace" selected>trace (1-10%)</option>
                                    <option value="and">and (35-50%)</option>
                                </select>
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label style="font-size: 0.75rem;">Material</label>
                                <select id="constituent_material" style="font-size: 0.8rem; padding: 0.35rem; width: 100%; border: 1px solid var(--border); border-radius: 4px;">
                                    <option value="">Select soil...</option>
                                    <option value="fine sand">fine sand</option>
                                    <option value="medium sand">medium sand</option>
                                    <option value="coarse sand">coarse sand</option>
                                    <option value="fine to coarse sand">fine to coarse sand</option>
                                    <option value="fine to medium sand">fine to medium sand</option>
                                    <option value="medium to coarse sand">medium to coarse sand</option>
                                    <option value="silt">silt</option>
                                    <option value="clay">clay</option>
                                    <option value="gravel">gravel</option>
                                    <option value="fine gravel">fine gravel</option>
                                    <option value="medium gravel">medium gravel</option>
                                    <option value="coarse gravel">coarse gravel</option>
                                    <option value="mica">mica</option>
                                    <option value="organic matter">organic matter</option>
                                    <option value="shells">shells</option>
                                    <option value="roots">roots</option>
                                    <option value="cobbles">cobbles</option>
                                    <option value="boulders">boulders</option>
                                    <option value="silty clay">silty clay</option>
                                    <option value="clayey silt">clayey silt</option>
                                    <option value="sandy silt">sandy silt</option>
                                    <option value="sandy clay">sandy clay</option>
                                </select>
                            </div>
                        </div>
                        
                        <button type="button" class="btn" style="background: var(--purple-600); color: white; border-color: var(--purple-700); padding: 0.35rem 0; font-size: 0.85rem; font-weight: bold; border-radius: 4px; cursor: pointer;" onclick="addConstituentFromUI()">💾 Save Constituent</button>
                        
                        <!-- List of added constituents -->
                        <div id="constituents_list_container" style="margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.25rem;">
                            <!-- Dynamically generated list items will appear here -->
                        </div>
                        
                        <!-- Hidden inputs to link with existing JS database structure -->
                        <input type="hidden" id="rel_minor_1">
                        <input type="hidden" id="rel_minor_2">
                        <input type="hidden" id="rel_minor_3">
                    </div>"""

# Replace the minors block in the extracted card
modified_card = col3_block.replace(old_minor_block, new_minor_block)
if modified_card == col3_block:
    # Try with single-quotes or direct regex if there's any whitespace difference
    print("Warning: Direct minor components block replace failed! Trying whitespace-insensitive replacement...")
    # Clean up whitespace and try again
    pattern = re.compile(r'<div style="background:\s*#f8fafc;\s*border:\s*1px\s*solid\s*#e2e8f0;.*?<label style="font-size:\s*0.75rem;">Minor\s*3.*?</div>\s*</div>', re.DOTALL)
    modified_card = pattern.sub(new_minor_block, col3_block)

# Also update the submit button in the modified card to trigger saveSampleLayer
old_submit_btn = '<button type="submit" class="btn btn-success" style="width: 100%; padding: 0.75rem; font-size: 1.15rem; font-weight: 700; border-radius: 8px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.25);">'
new_submit_btn = '<button type="button" class="btn btn-success" style="width: 100%; padding: 0.75rem; font-size: 1.15rem; font-weight: 700; border-radius: 8px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.25);" onclick="saveSampleLayer()">'
modified_card = modified_card.replace(old_submit_btn, new_submit_btn)

# Add Tab 3 error container at the bottom of the card (inside the main wrapper of modified_card)
error_container_html = """
                <!-- ERROR MESSAGE CONTAINER FOR TAB 3 -->
                <div id="boringFormErrorTab3" style="display: none; background-color: #fee2e2; border: 1px solid #fca5a5; color: #b91c1c; padding: 0.75rem 1rem; border-radius: 6px; font-weight: bold; font-size: 0.95rem; margin-top: 0.5rem; align-items: center; gap: 0.5rem;">
                    ⚠️ <span id="boringFormErrorTextTab3"></span>
                </div>
"""
# Insert before the last closing </div> of modified_card
last_div_idx = modified_card.rfind('</div>')
if last_div_idx != -1:
    modified_card = modified_card[:last_div_idx] + error_container_html + modified_card[last_div_idx:]

# 3. Locate Tab 3 (Sample Run Details) layout wrapper and replace it
# It starts around: <div style="max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem;">
# inside <div id="tab-sample-run-details" class="tab-content">
# and ends with the corresponding closing </div>
tab3_start_marker = '<div id="tab-sample-run-details" class="tab-content">'
tab3_start_idx = content.find(tab3_start_marker)
if tab3_start_idx == -1:
    print("Error: Could not find Tab 3 start marker!")
    exit(1)

# Find the next 600px wrapper start
wrapper_start_str = '<div style="max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem;">'
wrapper_start_idx = content.find(wrapper_start_str, tab3_start_idx)
if wrapper_start_idx == -1:
    print("Error: Could not find Tab 3 wrapper start!")
    exit(1)

# Find the closing </div> of the wrapper
# We will match matching braces
open_divs = 1
idx = wrapper_start_idx + len(wrapper_start_str)
while open_divs > 0 and idx < len(content):
    if content[idx:idx+5] == '<div ':
        open_divs += 1
    elif content[idx:idx+6] == '<div\\t' or content[idx:idx+6] == '<div\\n' or content[idx:idx+6] == '<div\\r':
        open_divs += 1
    elif content[idx:idx+5] == '<div/':
        pass
    elif content[idx:idx+4] == '<div':
        # could be <div style...
        if content[idx+4] == ' ' or content[idx+4] == '>':
            open_divs += 1
    elif content[idx:idx+6] == '</div>':
        open_divs -= 1
    idx += 1

wrapper_end_idx = idx

# Extract the inner elements of the wrapper
inner_wrapper = content[wrapper_start_idx + len(wrapper_start_str) : wrapper_end_idx - 6].strip()

# Assemble the new two-column layout for Tab 3
new_tab3_layout = f\"\"\"        <div class="boring-info-grid" style="display: grid; grid-template-columns: 1fr 1.25fr; gap: 1.5rem; margin-bottom: 1.5rem; align-items: start;">
            <!-- Column 1: Sample Run Details -->
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                {inner_wrapper}
            </div>
            
            {modified_card}
        </div>\"\"\"

# Replace in content
content = content[:wrapper_start_idx] + new_tab3_layout + content[wrapper_end_idx:]

# Write the modified content back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("HTML Relocation and Modifying completed successfully!")
