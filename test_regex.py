import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

matches = set(re.findall(r'(?<![a-zA-Z])([BSL])(\d+)', text))
# Let's print the actual full strings that contain these matches to be sure.
full_matches = set(re.findall(r'[a-zA-Z0-9]*[BSL]\d+[a-zA-Z0-9]*', text))
print(sorted(list(full_matches)))
