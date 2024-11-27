const fs = require('fs').promises;
const path = require('path');

export default async function readDirectoryAsync(dirPath) {
  try {
    // Reading all files and directories in the given directory
    const entries = await fs.readdir(dirPath);
    
    // Filtering only directories
    const directories = await Promise.all(
      entries.map(async entry => {
        const fullPath = path.join(dirPath, entry);
        const stats = await fs.stat(fullPath);
        return stats.isDirectory() ? fullPath : null;
      })
    )
    .then(results => results.filter(Boolean));

    return directories;
  } catch (err) {
    console.error(`Ошибка при чтении директории: ${err}`);
    return [];
  }
}