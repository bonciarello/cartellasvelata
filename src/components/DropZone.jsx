import { useState, useCallback, useRef } from 'react';
import { analyzeFiles, readDirectoryRecursive } from '../utils/analyzeFolder';
import StatsCards from './StatsCards';
import PieChart from './PieChart';
import FileTable from './FileTable';

export default function DropZone({ onData }) {
  const [dragOver, setDragOver] = useState(false);
  const [folderPath, setFolderPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const processFiles = useCallback(
    (files, name) => {
      if (!files || files.length === 0) {
        setError('Nessun file trovato nella cartella. Prova con una cartella che contiene file.');
        return;
      }
      setError('');
      const data = analyzeFiles(files);
      if (name) data.folderName = name;
      onData(data);
    },
    [onData]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      const items = e.dataTransfer?.items;
      if (!items) return;
      const files = [];
      const collect = (entry) => {
        if (entry.isFile) {
          entry.file((f) => {
            f.webkitRelativePath = entry.fullPath.replace(/^\//, '');
            files.push(f);
            if (files.length === 1) setFolderPath(entry.fullPath.split('/').filter(Boolean)[0] || '');
          });
        } else if (entry.isDirectory) {
          const reader = entry.createReader();
          reader.readEntries((entries) => entries.forEach(collect));
        }
      };
      let count = 0;
      for (let i = 0; i < items.length; i++) {
        const entry = items[i].webkitGetAsEntry?.();
        if (entry) { count++; collect(entry); }
      }
      // Dopo un breve delay per permettere la lettura
      setTimeout(() => {
        if (count > 0 && files.length > 0) {
          processFiles(files);
        }
      }, 300);
    },
    [processFiles]
  );

  const handleInputChange = useCallback(
    (e) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      processFiles(files);
    },
    [processFiles]
  );

  const handleSelectFolder = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      if ('showDirectoryPicker' in window) {
        const dirHandle = await window.showDirectoryPicker();
        const files = await readDirectoryRecursive(dirHandle);
        processFiles(files, dirHandle.name);
      } else {
        // Fallback: usa l'input file
        inputRef.current?.click();
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Impossibile accedere alla cartella. ' + (err.message || ''));
      }
    } finally {
      setLoading(false);
    }
  }, [processFiles]);

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  return (
    <div>
      <div
        className={`drop-zone${dragOver ? ' drop-zone--active' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="region"
        aria-label="Zona di rilascio cartella"
      >
        <input
          ref={inputRef}
          type="file"
          webkitdirectory=""
          directory=""
          multiple
          onChange={handleInputChange}
          className="drop-zone__input"
          id="folder-input"
          aria-hidden="true"
        />

        <div className="drop-zone__content">
          <svg className="drop-zone__icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            <line x1="12" y1="11" x2="12" y2="17"/>
            <line x1="9" y1="14" x2="15" y2="14"/>
          </svg>
          <div>
            <p className="drop-zone__title">Trascina qui una cartella</p>
            <p className="drop-zone__hint">oppure usa uno dei metodi qui sotto</p>
          </div>
        </div>
      </div>

      <div className="folder-actions">
        <button
          className="btn btn--primary"
          onClick={handleSelectFolder}
          disabled={loading}
          aria-label="Seleziona una cartella dal tuo computer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
          {loading ? 'Lettura in corso…' : 'Seleziona cartella'}
        </button>

        <label className="btn btn--secondary" htmlFor="folder-input">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Carica cartella
        </label>
      </div>

      <div className="path-display">
        <label htmlFor="folder-path" className="path-display__label">Percorso cartella</label>
        <div className="path-display__wrapper">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="path-display__icon">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          <input
            id="folder-path"
            type="text"
            className="path-display__input"
            placeholder="es. /Users/nome/Documenti/progetto — incolla qui per riferimento"
            value={folderPath}
            onChange={(e) => setFolderPath(e.target.value)}
            aria-describedby="path-hint"
          />
        </div>
        <span id="path-hint" className="path-display__hint">
          Incolla qui il percorso per tenerne traccia. L'analisi avviene sempre nel browser.
        </span>
      </div>

      {error && (
        <div className="error-msg" role="alert">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
