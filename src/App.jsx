import React, { useEffect, useMemo, useState } from 'react';
import SignatureForm from './components/SignatureForm.jsx';
import SignaturePreview from './components/SignaturePreview.jsx';
import { buildSignatureHTML } from './signatureTemplate.js';

const STORAGE_KEY = 'signature-gmail:data:v2';

const DEFAULT_DATA = {
  firstName: 'Jean',
  lastName: 'Dupont',
  jobTitle: 'Chef de projet',
  department: 'Marketing',
  email: 'jean.dupont@entreprise.com',
  phone: '+33 1 23 45 67 89',
  mobile: '+33 6 12 34 56 78',
  website: 'entreprise.com',
  website2: '',
  linkedin: 'linkedin.com/in/jeandupont',
  twitter: '',
  instagram: '',
  youtube: '',
  color: '#2563eb',
  logoUrl: '',
  theme: 'classic'
};

function loadInitialData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DATA;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_DATA, ...parsed };
  } catch {
    return DEFAULT_DATA;
  }
}

export default function App() {
  const [data, setData] = useState(loadInitialData);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore quota errors */
    }
  }, [data]);

  const html = useMemo(() => buildSignatureHTML(data, data.theme), [data]);

  const handleThemeChange = (newTheme) => {
    setData({ ...data, theme: newTheme });
  };

  const handleReset = () => {
    if (confirm('Réinitialiser tous les champs ?')) {
      setData(DEFAULT_DATA);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-white">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-bold shadow-soft"
              style={{ background: data.color }}
              aria-hidden
            >
              @
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-semibold text-slate-900 leading-tight">
                Générateur de Signature Gmail
              </h1>
              <p className="text-xs text-slate-500">
                Thèmes multiples + 5 designs professionnels.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline text-xs text-slate-400">
            Compatible Gmail • HTML tables
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          <section
            aria-label="Formulaire"
            className="lg:col-span-3 order-2 lg:order-1"
          >
            <SignatureForm
              data={data}
              onChange={setData}
              onReset={handleReset}
            />
          </section>

          <section
            aria-label="Prévisualisation"
            className="lg:col-span-2 order-1 lg:order-2"
          >
            <div className="lg:sticky lg:top-24">
              <SignaturePreview
                html={html}
                theme={data.theme}
                onThemeChange={handleThemeChange}
              />
            </div>
          </section>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-xs text-slate-400">
        Vos données sont stockées localement dans votre navigateur. Aucun serveur impliqué.
      </footer>
    </div>
  );
}
