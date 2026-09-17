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

    // Backgrounds
    content = content.replace(/bg-card dark:bg-zinc-900(?:\/\d+)?/g, 'bg-card');
    content = content.replace(/bg-background dark:bg-zinc-950(?:\/\d+)?/g, 'bg-background');
    content = content.replace(/bg-zinc-50 dark:bg-zinc-950(?:\/\d+)?/g, 'bg-background');
    content = content.replace(/bg-muted dark:bg-zinc-800(?:\/\d+)?/g, 'bg-muted');

    // Borders
    content = content.replace(/border-border dark:border-zinc-800(?:\/\d+)?/g, 'border-border');
    content = content.replace(/border-border dark:border-zinc-700(?:\/\d+)?/g, 'border-border');

    // Text
    content = content.replace(/text-muted-foreground dark:text-zinc-400/g, 'text-muted-foreground');
    content = content.replace(/text-muted-foreground dark:text-zinc-500/g, 'text-muted-foreground');
    content = content.replace(/text-foreground dark:text-zinc-300/g, 'text-foreground');
    content = content.replace(/text-foreground dark:text-zinc-200/g, 'text-foreground');
    content = content.replace(/text-foreground dark:text-white/g, 'text-foreground');
    content = content.replace(/text-foreground dark:text-zinc-400/g, 'text-foreground');

    // Hovers
    content = content.replace(/hover:bg-muted dark:bg-zinc-800(?:\/\d+)?/g, 'hover:bg-accent');
    content = content.replace(/hover:text-foreground dark:hover:text-white/g, 'hover:text-accent-foreground');
    content = content.replace(/hover:text-foreground dark:hover:text-zinc-300/g, 'hover:text-accent-foreground');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Cleaned', filePath);
    }
  }
});
