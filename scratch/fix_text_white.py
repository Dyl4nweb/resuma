import os
import re

def fix_text_white(dir_path):
    for root, _, files in os.walk(dir_path):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Find all classNames and only replace text-white with text-foreground 
                # if there is no bg-{color}-600 or bg-zinc-900 or bg-black in the same className string.
                def repl(match):
                    class_str = match.group(0)
                    
                    # If this class string has a specific hardcoded solid background color, keep text-white
                    # bg-red-600, bg-amber-600, bg-blue-600, bg-black, bg-zinc-900
                    if re.search(r'bg-(red|amber|blue|green|emerald|purple|indigo)-\d+', class_str) or \
                       'bg-black' in class_str or 'bg-zinc-900' in class_str or 'bg-gradient' in class_str:
                        return class_str
                    
                    # Otherwise, it should be text-foreground (adapts to light/dark)
                    # Note: we are replacing text-white with text-foreground
                    return class_str.replace('text-white', 'text-foreground')

                # Regex to find className="..."
                new_content = re.sub(r'className="([^"]*)"', repl, content)
                new_content = re.sub(r'className=\{`([^`]*)`\}', repl, new_content)

                if new_content != content:
                    print(f"Fixed {path}")
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)

fix_text_white('c:/Projects/Resuma/src')
