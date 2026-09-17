import os

def fix_hover(dir_path):
    for root, _, files in os.walk(dir_path):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()

                new_content = content.replace('hover:bg-zinc-700', 'hover:bg-zinc-200')
                new_content = new_content.replace('hover:text-white', 'hover:text-foreground')

                if new_content != content:
                    print(f"Fixed {path}")
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)

fix_hover('c:/Projects/Resuma/src')
