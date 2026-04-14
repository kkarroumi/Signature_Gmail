# Signature_Gmail

Générateur de **signatures d'email professionnelles** pour Gmail — SPA React + Tailwind CSS.

## Fonctionnalités

- Interface deux colonnes (formulaire + prévisualisation) — responsive.
- Live preview : mise à jour instantanée à chaque frappe.
- Rendu fidèle **HTML tables-based** compatible Gmail.
- Icônes sociales inline (SVG data-uri) teintées à la couleur choisie.
- Boutons d'export :
  - **Copier la signature** (collage visuel direct dans Gmail).
  - **Copier le code HTML** (source brut).
- Persistance automatique via `localStorage`.
- Tailwind CSS pour une UI moderne et épurée.

## Installation

```bash
npm install
npm run dev
```

L'application est alors disponible sur [http://localhost:5173](http://localhost:5173).

## Build de production

```bash
npm run build
npm run preview
```

## Structure

```
src/
  App.jsx                       # Layout + state + persistance
  main.jsx                      # Point d'entrée React
  index.css                     # Tailwind + styles utilitaires
  signatureTemplate.js          # Génération du HTML (tables)
  components/
    SignatureForm.jsx           # Formulaire
    SignaturePreview.jsx        # Aperçu + actions copier
```

## Utilisation dans Gmail

1. Cliquez sur **Copier la signature**.
2. Dans Gmail : *Paramètres → Général → Signature → Créer/Modifier*.
3. Collez (Ctrl/Cmd + V) dans l'éditeur Gmail.
4. Enregistrez.
