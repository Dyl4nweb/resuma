const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Fix double text-zinc classes from the previous regex
    content = content.replace(/dark:text-muted-foreground dark:text-zinc-500/g, 'dark:text-zinc-500');
    content = content.replace(/dark:text-muted-foreground dark:text-zinc-400/g, 'dark:text-zinc-400');
    content = content.replace(/text-foreground dark:text-foreground/g, 'text-foreground');

    // Soften bg-zinc-950 in light mode to bg-zinc-50 instead of bg-background
    // This gives some depth instead of flat white everywhere
    content = content.replace(/bg-background dark:bg-zinc-950/g, 'bg-zinc-50 dark:bg-zinc-950');
    
    // Ensure all `text-white` have a light mode alternative if they aren't part of buttons
    // Since we can't reliably regex that, we'll manually check the marketing page instead of this script.
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed', filePath);
    }
  }
});
