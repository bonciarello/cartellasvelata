/**
 * Test suite per CartellaSvelata
 * Testa le funzioni di utilità di analisi cartelle
 */

import { analyzeFiles, formatSize, formatMB } from '../src/utils/analyzeFolder.js';

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${msg}`);
  } else {
    failed++;
    console.error(`  ✗ ${msg}`);
  }
}

function assertEqual(actual, expected, msg) {
  if (actual === expected) {
    passed++;
    console.log(`  ✓ ${msg}`);
  } else {
    failed++;
    console.error(`  ✗ ${msg} — atteso "${expected}", ricevuto "${actual}"`);
  }
}

function assertApprox(actual, expected, epsilon, msg) {
  if (Math.abs(actual - expected) <= epsilon) {
    passed++;
    console.log(`  ✓ ${msg}`);
  } else {
    failed++;
    console.error(`  ✗ ${msg} — atteso ~${expected}, ricevuto ${actual}`);
  }
}

// ---- Mock File ----
function mockFile(name, size) {
  return {
    name,
    size,
    webkitRelativePath: `test-folder/${name}`,
  };
}

// ---- Test: analyzeFiles ----
console.log('\n📁 analyzeFiles');
{
  const files = [
    mockFile('foto.jpg', 1024 * 1024 * 5),       // 5 MB
    mockFile('doc.pdf', 1024 * 1024 * 2),         // 2 MB
    mockFile('script.js', 1024 * 500),            // 500 KB
    mockFile('style.css', 1024 * 300),            // 300 KB
    mockFile('readme.md', 1024 * 10),             // 10 KB
    mockFile('altro.jpg', 1024 * 1024 * 3),       // 3 MB
    mockFile('data.json', 1024 * 100),            // 100 KB
    mockFile('main.js', 1024 * 200),              // 200 KB
  ];

  const result = analyzeFiles(files);

  assertEqual(result.folderName, 'test-folder', 'nome cartella corretto');
  assertEqual(result.totalFiles, 8, 'totale file = 8');
  assert(result.totalSize > 0, 'dimensione totale > 0');

  // Verifica estensioni
  const extNames = result.extensions.map(e => e.ext);
  assert(extNames.includes('jpg'), 'jpg presente nelle estensioni');
  assert(extNames.includes('pdf'), 'pdf presente nelle estensioni');
  assert(extNames.includes('js'), 'js presente nelle estensioni');

  // Le prime 5 estensioni devono essere ordinate per conteggio
  assert(result.extensions[0].count >= result.extensions[1].count, 'estensioni ordinate per count');

  // Top 10 file più grandi
  assertEqual(result.largest.length, 8, 'tutti gli 8 file nella lista largest');
  assert(result.largest[0].size >= result.largest[1].size, 'largest ordinati per size decrescente');
  assertEqual(result.largest[0].name, 'foto.jpg', 'il file più grande è foto.jpg (5MB)');

  // La cartella ha almeno 1 file
  assert(result.totalFiles >= 1, 'cartella con almeno un file analizzata');
}

// ---- Test: formatSize ----
console.log('\n📏 formatSize');
{
  assertEqual(formatSize(0), '0 B', '0 byte');
  assertEqual(formatSize(500), '500 B', '500 byte');
  assertEqual(formatSize(1024), '1 KB', '1024 byte = 1 KB');
  assertEqual(formatSize(1536), '2 KB', '1536 byte ≈ 2 KB');
  assert(formatSize(1048576).startsWith('1'), '1 MB');
  assert(formatSize(1073741824).startsWith('1'), '1 GB');
}

// ---- Test: formatMB ----
console.log('\n📏 formatMB');
{
  assert(formatMB(1048576).startsWith('1.00'), '1 MB = 1.00 MB');
  assert(formatMB(5242880).startsWith('5.00'), '5 MB');
  assert(formatMB(0).includes('0.00'), '0 byte = 0.00 MB');
}

// ---- Test: analisi con file senza estensione ----
console.log('\n📁 File senza estensione');
{
  const files = [
    mockFile('Makefile', 1024),
    mockFile('README', 2048),
    mockFile('script.js', 4096),
  ];
  const result = analyzeFiles(files);
  const noExt = result.extensions.find(e => e.ext === 'senza estensione');
  assert(noExt !== undefined, 'categoria "senza estensione" presente');
  assertEqual(noExt.count, 2, '2 file senza estensione');
}

// ---- Test: cartella vuota (nessun file) ----
console.log('\n📁 Cartella con un solo file vuoto');
{
  const files = [mockFile('.hidden', 0)];
  const result = analyzeFiles(files);
  assert(result.totalFiles >= 0, 'gestisce file vuoti senza crash');
}

// ---- Test: edge case - nomi con punti multipli ----
console.log('\n📁 Nomi con punti multipli');
{
  const files = [
    mockFile('archive.tar.gz', 1024 * 1024),
  ];
  const result = analyzeFiles(files);
  const ext = result.extensions.find(e => e.ext === 'gz');
  assert(ext !== undefined, 'estensione = gz (ultimo punto)');
}

// ---- Riepilogo ----
console.log(`\n${'='.repeat(40)}`);
console.log(`  Passati: ${passed}  |  Falliti: ${failed}`);
console.log(`${'='.repeat(40)}\n`);

process.exit(failed > 0 ? 1 : 0);
