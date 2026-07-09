/**
 * Analizza una lista di File (da webkitdirectory o File System Access API)
 * e restituisce statistiche complete.
 */

export function analyzeFiles(fileList) {
  const files = Array.from(fileList).filter((f) => f.size > 0 || f.type !== '' || f.name.includes('.'));
  const totalFiles = files.length;
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  // Raggruppa per estensione
  const byExt = {};
  files.forEach((f) => {
    const ext = getExtension(f.name);
    if (!byExt[ext]) {
      byExt[ext] = { count: 0, size: 0 };
    }
    byExt[ext].count += 1;
    byExt[ext].size += f.size;
  });

  // Ordina estensioni per conteggio decrescente
  const extensions = Object.entries(byExt)
    .map(([ext, data]) => ({
      ext,
      count: data.count,
      size: data.size,
      pct: totalSize > 0 ? (data.size / totalSize) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Top 10 file più grandi
  const largest = [...files]
    .sort((a, b) => b.size - a.size)
    .slice(0, 10)
    .map((f) => ({
      name: f.name,
      ext: getExtension(f.name),
      size: f.size,
      webkitRelativePath: f.webkitRelativePath || f.name,
    }));

  // Cartella radice (dal primo file con webkitRelativePath)
  let folderName = 'Cartella';
  const firstWithPath = files.find((f) => f.webkitRelativePath);
  if (firstWithPath && firstWithPath.webkitRelativePath) {
    const parts = firstWithPath.webkitRelativePath.split('/');
    folderName = parts[0] || 'Cartella';
  }

  return { folderName, totalFiles, totalSize, extensions, largest };
}

function getExtension(filename) {
  const dot = filename.lastIndexOf('.');
  if (dot <= 0) return 'senza estensione';
  return filename.slice(dot + 1).toLowerCase();
}

/**
 * Formatta byte in una stringa leggibile.
 */
export function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const val = bytes / Math.pow(1024, i);
  return val.toFixed(i >= 2 ? 2 : 0) + ' ' + units[i];
}

/**
 * Formatta byte in MB con 2 decimali.
 */
export function formatMB(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

/**
 * Analizza ricorsivamente una directory via File System Access API.
 */
export async function readDirectoryRecursive(dirHandle, basePath = '') {
  const files = [];
  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'file') {
      const file = await entry.getFile();
      // Simula webkitRelativePath
      file.webkitRelativePath = basePath ? `${basePath}/${entry.name}` : entry.name;
      files.push(file);
    } else if (entry.kind === 'directory') {
      const subPath = basePath ? `${basePath}/${entry.name}` : entry.name;
      const subFiles = await readDirectoryRecursive(entry, subPath);
      files.push(...subFiles);
    }
  }
  return files;
}
