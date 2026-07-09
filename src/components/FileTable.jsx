import { useState } from 'react';
import { formatMB } from '../utils/analyzeFolder';

export default function FileTable({ data }) {
  const [sortKey, setSortKey] = useState('size');
  const [sortDir, setSortDir] = useState('desc');

  if (!data || !data.largest || data.largest.length === 0) return null;

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'size' ? 'desc' : 'asc');
    }
  };

  const sorted = [...data.largest].sort((a, b) => {
    let cmp = 0;
    if (sortKey === 'name') cmp = a.name.localeCompare(b.name, 'it');
    else if (sortKey === 'ext') cmp = a.ext.localeCompare(b.ext, 'it');
    else cmp = a.size - b.size;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <span className="sort-indicator sort-indicator--inactive">▸</span>;
    return (
      <span className="sort-indicator sort-indicator--active" aria-label={sortDir === 'asc' ? 'Ordinato crescente' : 'Ordinato decrescente'}>
        {sortDir === 'asc' ? '▴' : '▾'}
      </span>
    );
  };

  return (
    <div className="table-section">
      <h2 className="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        I 10 file più grandi
      </h2>
      <div className="table-wrap">
        <table className="file-table" aria-label="Lista dei file più grandi ordinabile">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col" className="file-table__sortable" onClick={() => handleSort('name')} aria-sort={sortKey === 'name' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                Nome file <SortIcon col="name" />
              </th>
              <th scope="col" className="file-table__sortable" onClick={() => handleSort('ext')} aria-sort={sortKey === 'ext' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                Tipo <SortIcon col="ext" />
              </th>
              <th scope="col" className="file-table__sortable file-table__col--right" onClick={() => handleSort('size')} aria-sort={sortKey === 'size' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                Dimensione <SortIcon col="size" />
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((file, i) => (
              <tr key={file.webkitRelativePath || file.name + i}>
                <td className="file-table__rank">{i + 1}</td>
                <td className="file-table__name" title={file.webkitRelativePath || file.name}>
                  {file.name}
                </td>
                <td>
                  <span className="ext-badge">{file.ext}</span>
                </td>
                <td className="file-table__size">{formatMB(file.size)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
