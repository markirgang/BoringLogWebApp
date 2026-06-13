import re

def replacer(match):
    s = match.group(0)
    # Insert dash before any digit that is immediately preceded by B, S, or L
    s = re.sub(r'(?<=B)(\d+)', r'-\1', s)
    s = re.sub(r'(?<=S)(\d+)', r'-\1', s)
    s = re.sub(r'(?<=L)(\d+)', r'-\1', s)
    return s

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Match B followed by digits, optionally followed by S digits, optionally followed by L digits
# Or just S followed by digits, optionally L digits
# Or just L followed by digits.
# It must be surrounded by word boundaries \b
pattern = r'\b(?:B\d+(?:S\d+)?(?:L\d+)?|S\d+(?:L\d+)?|L\d+)\b'

new_text = re.sub(pattern, replacer, text)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_text)
