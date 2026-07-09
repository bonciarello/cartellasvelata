import { useState } from 'react';
import DropZone from './components/DropZone';
import StatsCards from './components/StatsCards';
import PieChart from './components/PieChart';
import FileTable from './components/FileTable';

export default function App() {
  const [data, setData] = useState(null);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__brand">
            <svg className="app-header__logo" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="15" r="3" strokeWidth="1.5" strokeDasharray="2 2"/>
            </svg>
            <div>
              <h1 className="app-header__title">CartellaSvelata</h1>
              <p className="app-header__subtitle">Scopri cosa occupa spazio nelle tue cartelle</p>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="input-section" aria-labelledby="input-heading">
          <h2 id="input-heading" className="sr-only">Carica una cartella da analizzare</h2>
          <DropZone onData={setData} />
        </section>

        {data && (
          <>
            <StatsCards data={data} />

            <div className="results-grid">
              <PieChart data={data} />
              <FileTable data={data} />
            </div>

            <details className="details-summary">
              <summary className="details-summary__toggle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                Riepilogo completo per estensione ({data.extensions.length} tipi)
              </summary>
              <div className="table-wrap">
                <table className="file-table" aria-label="Riepilogo completo di tutte le estensioni">
                  <thead>
                    <tr>
                      <th scope="col">Estensione</th>
                      <th scope="col" className="file-table__col--right">File</th>
                      <th scope="col" className="file-table__col--right">Spazio occupato</th>
                      <th scope="col" className="file-table__col--right">% sul totale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.extensions.map((e) => (
                      <tr key={e.ext}>
                        <td><span className="ext-badge">{e.ext}</span></td>
                        <td className="file-table__size">{e.count.toLocaleString('it-IT')}</td>
                        <td className="file-table__size">{e.size.toLocaleString('it-IT')} B</td>
                        <td className="file-table__size">{e.pct.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </>
        )}

        {!data && (
          <div className="empty-state">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="empty-state__icon">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              <path d="M9 14l2 2 4-4"/>
            </svg>
            <p className="empty-state__text">
              Trascina una cartella nell'area qui sopra oppure clicca <strong>Seleziona cartella</strong> per cominciare.
            </p>
            <p className="empty-state__sub">
              Tutta l'analisi avviene nel tuo browser. Nessun file viene mai caricato su un server.
            </p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          CartellaSvelata — analisi locale, nessun upload.{' '}
          <span className="app-footer__dot" aria-hidden="true">·</span>{' '}
          Basato su tecnologie browser standard
        </p>
      </footer>
    </div>
  );
}
