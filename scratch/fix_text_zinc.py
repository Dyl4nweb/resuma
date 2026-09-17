import os
import re

def fix_text_zinc(dir_path):
    for root, _, files in os.walk(dir_path):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Replace text-zinc-100, text-zinc-50 with text-foreground
                new_content = re.sub(r'text-zinc-100', 'text-foreground', content)
                new_content = re.sub(r'text-zinc-50\b', 'text-foreground', new_content)
                new_content = re.sub(r'text-zinc-200', 'text-foreground', new_content)

                if new_content != content:
                    print(f"Fixed {path}")
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)

fix_text_zinc('c:/Projects/Resuma/src')
