import React, { useRef, useState } from 'react';

export default function SignaturePreview({ html }) {
  const visualRef = useRef(null);
  const [toast, setToast] = useState('');
  const [showCode, setShowCode] = useState(false);

  const flash = (msg) => {
    setToast(msg);
    window.clearTimeout(flash._t);
    flash._t = window.setTimeout(() => setToast(''), 2200);
  };

  const copyVisual = async () => {
    const node = visualRef.current;
    if (!node) return;
    try {
      if (window.ClipboardItem && navigator.clipboard?.write) {
        const blobHtml = new Blob([node.innerHTML], { type: 'text/html' });
        const blobText = new Blob([node.innerText], { type: 'text/plain' });
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': blobHtml,
            'text/plain': blobText
          })
        ]);
        flash('Signature copiée — collez-la dans Gmail ✨');
        return;
      }
    } catch (err) {
      // fallback below
    }
    // Fallback: selection-based rich copy
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(node);
    sel.removeAllRanges();
    sel.addRange(range);
    const ok = document.execCommand('copy');
    sel.removeAllRanges();
    flash(ok ? 'Signature copiée ✨' : 'Impossible de copier');
  };

  const copyHTML = async () => {
    try {
      await navigator.clipboard.writeText(html);
      flash('Code HTML copié dans le presse-papiers');
    } catch {
      flash('Impossible de copier le HTML');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Prévisualisation</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Rendu exact tel qu'il apparaîtra dans un email.
          </p>
        </div>
        <button
          type="button"
          className="btn-ghost text-xs"
          onClick={() => setShowCode((v) => !v)}
        >
          {showCode ? 'Masquer HTML' : 'Afficher HTML'}
        </button>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200/70 shadow-card overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-100 bg-slate-50/70">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
          <span className="ml-3 text-xs text-slate-500">aperçu@signature.email</span>
        </div>
        <div className="p-6 bg-white">
          <div
            ref={visualRef}
            className="preview-area"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button type="button" className="btn-primary" onClick={copyVisual}>
          Copier la signature
        </button>
        <button type="button" className="btn-secondary" onClick={copyHTML}>
          Copier le code HTML
        </button>
      </div>

      {showCode && (
        <div className="rounded-2xl bg-slate-900 text-slate-100 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-slate-950/40">
            <span className="text-xs font-medium text-slate-300">HTML source</span>
            <button
              className="text-xs text-slate-300 hover:text-white"
              onClick={copyHTML}
            >
              Copier
            </button>
          </div>
          <pre className="scroll-area text-xs p-4 max-h-72 overflow-auto whitespace-pre-wrap break-all">
{html}
          </pre>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                        rounded-full bg-slate-900 text-white text-sm
                        px-4 py-2 shadow-card animate-[fade_0.2s_ease-out]">
          {toast}
        </div>
      )}
    </div>
  );
}
