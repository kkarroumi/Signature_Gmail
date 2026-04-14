import React from 'react';

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div className="section-card">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

export default function SignatureForm({ data, onChange, onReset }) {
  const update = (key) => (e) => onChange({ ...data, [key]: e.target.value });

  return (
    <div className="space-y-5">
      <Section title="Informations personnelles" subtitle="Votre identité professionnelle">
        <Field label="Prénom">
          <input
            className="field-input"
            type="text"
            value={data.firstName}
            onChange={update('firstName')}
            placeholder="Jean"
          />
        </Field>
        <Field label="Nom">
          <input
            className="field-input"
            type="text"
            value={data.lastName}
            onChange={update('lastName')}
            placeholder="Dupont"
          />
        </Field>
        <Field label="Poste">
          <input
            className="field-input"
            type="text"
            value={data.jobTitle}
            onChange={update('jobTitle')}
            placeholder="Chef de projet"
          />
        </Field>
        <Field label="Département">
          <input
            className="field-input"
            type="text"
            value={data.department}
            onChange={update('department')}
            placeholder="Marketing"
          />
        </Field>
      </Section>

      <Section title="Coordonnées" subtitle="Comment vous joindre">
        <Field label="Email">
          <input
            className="field-input"
            type="email"
            value={data.email}
            onChange={update('email')}
            placeholder="jean.dupont@entreprise.com"
          />
        </Field>
        <Field label="Site Web">
          <input
            className="field-input"
            type="text"
            value={data.website}
            onChange={update('website')}
            placeholder="entreprise.com"
          />
        </Field>
        <Field label="Téléphone (Fixe)">
          <input
            className="field-input"
            type="tel"
            value={data.phone}
            onChange={update('phone')}
            placeholder="+33 1 23 45 67 89"
          />
        </Field>
        <Field label="Téléphone (Mobile)">
          <input
            className="field-input"
            type="tel"
            value={data.mobile}
            onChange={update('mobile')}
            placeholder="+33 6 12 34 56 78"
          />
        </Field>
      </Section>

      <Section title="Réseaux sociaux" subtitle="Liens complets ou URLs courtes">
        <Field label="LinkedIn">
          <input
            className="field-input"
            type="text"
            value={data.linkedin}
            onChange={update('linkedin')}
            placeholder="linkedin.com/in/jeandupont"
          />
        </Field>
        <Field label="Twitter / X">
          <input
            className="field-input"
            type="text"
            value={data.twitter}
            onChange={update('twitter')}
            placeholder="x.com/jeandupont"
          />
        </Field>
        <Field label="Instagram">
          <input
            className="field-input"
            type="text"
            value={data.instagram}
            onChange={update('instagram')}
            placeholder="instagram.com/jeandupont"
          />
        </Field>
      </Section>

      <Section title="Design" subtitle="Personnalisez l'identité visuelle">
        <Field label="Couleur (Hex)">
          <div className="flex items-center gap-3">
            <input
              type="color"
              className="h-10 w-12 rounded-lg border border-slate-200 bg-white cursor-pointer"
              value={data.color}
              onChange={update('color')}
            />
            <input
              className="field-input"
              type="text"
              value={data.color}
              onChange={update('color')}
              placeholder="#0f172a"
            />
          </div>
        </Field>
        <Field label="URL du logo / photo">
          <input
            className="field-input"
            type="url"
            value={data.logoUrl}
            onChange={update('logoUrl')}
            placeholder="https://..."
          />
        </Field>
      </Section>

      <div className="flex items-center justify-end">
        <button type="button" className="btn-ghost" onClick={onReset}>
          Réinitialiser
        </button>
      </div>
    </div>
  );
}
