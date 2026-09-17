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
    
    content = content.replace(/bg-\[\#09090b\]/g, 'bg-background');
    content = content.replace(/text-\[\#fafafa\]/g, 'text-foreground');
    content = content.replace(/bg-zinc-950/g, 'bg-background dark:bg-zinc-950');
    content = content.replace(/bg-zinc-900/g, 'bg-card dark:bg-zinc-900');
    content = content.replace(/bg-zinc-800/g, 'bg-muted dark:bg-zinc-800');
    content = content.replace(/border-zinc-800/g, 'border-border dark:border-zinc-800');
    content = content.replace(/border-zinc-700/g, 'border-border dark:border-zinc-700');
    
    // Text colors
    content = content.replace(/text-zinc-500/g, 'text-muted-foreground dark:text-zinc-500');
    content = content.replace(/text-zinc-400/g, 'text-muted-foreground dark:text-zinc-400');
    content = content.replace(/text-zinc-300/g, 'text-foreground dark:text-zinc-300');
    content = content.replace(/text-zinc-200/g, 'text-foreground dark:text-zinc-200');
    
    // specific hover text colors
    content = content.replace(/hover:text-zinc-300/g, 'hover:text-foreground dark:hover:text-zinc-300');
    content = content.replace(/hover:text-white/g, 'hover:text-foreground dark:hover:text-white');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
