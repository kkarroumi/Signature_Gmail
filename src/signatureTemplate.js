// Brand colors + labels for social badges (colored TD cells — Gmail-proof).
const SOCIAL_BRANDS = {
  linkedin:  { bg: '#0A66C2', label: 'in' },
  twitter:   { bg: '#000000', label: '𝕏' },
  instagram: { bg: '#E4405F', label: 'IG' },
  youtube:   { bg: '#FF0000', label: '▶' }
};

// Emoji icons — render natively in Gmail/Outlook/Apple Mail.
const CONTACT_ICONS = {
  mail:   '📧',
  phone:  '📞',
  mobile: '📱',
  web:    '🌐'
};

// Theme registry.
export const THEMES = [
  { id: 'classic', name: 'Classic', description: 'Barre latérale colorée' },
  { id: 'modern',  name: 'Modern',  description: 'Nom en gras avec divider' },
  { id: 'minimal', name: 'Minimal', description: 'Texte épuré sans icônes' },
  { id: 'banner',  name: 'Banner',  description: 'En-tête coloré' },
  { id: 'compact', name: 'Compact', description: 'Format horizontal' }
];

// ==================== Helpers ====================
const escape = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const ensureProtocol = (url) => {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

const telHref = (tel) => `tel:${tel.replace(/[^\d+]/g, '')}`;

// Contact icon span (emoji, inherits no color — emojis have native colors).
function contactIcon(type, size = 14) {
  const ch = CONTACT_ICONS[type] || '•';
  return `<span style="font-size: ${size}px; line-height: 1; display: inline-block;">${ch}</span>`;
}

// Social badge — colored cell with letter. Works in every email client.
function socialBadge(brand, href, size = 24) {
  if (!href) return '';
  const info = SOCIAL_BRANDS[brand];
  if (!info) return '';
  const fs = info.label.length === 1 ? Math.round(size * 0.55) : Math.round(size * 0.42);
  return `<td style="padding-right: 6px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="width: ${size}px; height: ${size}px; background-color: ${info.bg}; text-align: center; vertical-align: middle; border-radius: 4px;">
        <a href="${escape(ensureProtocol(href))}" style="display: inline-block; width: ${size}px; height: ${size}px; line-height: ${size}px; color: #ffffff; text-decoration: none; font-family: Arial, Helvetica, sans-serif; font-size: ${fs}px; font-weight: bold;">${info.label}</a>
      </td>
    </tr></table>
  </td>`;
}

function allSocials(data, size = 24) {
  return [
    socialBadge('linkedin',  data.linkedin,  size),
    socialBadge('twitter',   data.twitter,   size),
    socialBadge('instagram', data.instagram, size),
    socialBadge('youtube',   data.youtube,   size)
  ].join('');
}

// Safe logo <img> — uses external URL (Gmail accepts hosted images).
function logoImg(data, size = 80, radius = 6) {
  if (!data.logoUrl) return '';
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ');
  return `<img src="${escape(ensureProtocol(data.logoUrl))}" alt="${escape(fullName)}" width="${size}" height="${size}" style="display:block; border:0; border-radius:${radius}px; max-width:${size}px; height:auto;" />`;
}

// ==================== Dispatcher ====================
export function buildSignatureHTML(data, themeId = 'classic') {
  const builders = {
    classic: buildClassic,
    modern:  buildModern,
    minimal: buildMinimal,
    banner:  buildBanner,
    compact: buildCompact
  };
  return (builders[themeId] || builders.classic)(data);
}

// ==================== THEME 1: CLASSIC ====================
function buildClassic(data) {
  const {
    firstName = '', lastName = '', jobTitle = '', department = '',
    email = '', phone = '', mobile = '', website = '', website2 = '',
    color = '#0f172a'
  } = data;

  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const title = [jobTitle, department].filter(Boolean).join(' • ');
  const baseFont = "font-family: Arial, Helvetica, sans-serif; color: #1f2937; font-size: 13px; line-height: 1.5;";

  const row = (type, label, href) => {
    if (!label) return '';
    return `<tr>
      <td style="padding: 2px 8px 2px 0; vertical-align: middle; width: 18px;">${contactIcon(type, 14)}</td>
      <td style="padding: 2px 0; ${baseFont}">
        ${href ? `<a href="${escape(href)}" style="color:#1f2937; text-decoration: none;">${escape(label)}</a>` : escape(label)}
      </td>
    </tr>`;
  };

  const socials = allSocials(data, 24);
  const socialsRow = socials
    ? `<tr><td style="padding-top: 10px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${socials}</tr></table></td></tr>`
    : '';

  const logoCell = data.logoUrl
    ? `<td style="padding-right: 20px; vertical-align: top;">${logoImg(data, 80, 6)}</td>`
    : '';

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="${baseFont}">
  <tr>
    ${logoCell}
    <td style="vertical-align: top; border-left: 3px solid ${escape(color)}; padding-left: 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 17px; font-weight: bold; color: ${escape(color)}; padding-bottom: 2px;">${escape(fullName) || '&nbsp;'}</td></tr>
        ${title ? `<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #475569; padding-bottom: 8px;">${escape(title)}</td></tr>` : ''}
        <tr><td style="padding-top: 4px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            ${row('mail',   email,    email ? `mailto:${email}` : '')}
            ${row('phone',  phone,    phone ? telHref(phone) : '')}
            ${row('mobile', mobile,   mobile ? telHref(mobile) : '')}
            ${row('web',    website,  website ? ensureProtocol(website) : '')}
            ${row('web',    website2, website2 ? ensureProtocol(website2) : '')}
          </table>
        </td></tr>
        ${socialsRow}
      </table>
    </td>
  </tr>
</table>`;
}

// ==================== THEME 2: MODERN ====================
function buildModern(data) {
  const {
    firstName = '', lastName = '', jobTitle = '', department = '',
    email = '', phone = '', mobile = '', website = '', website2 = '',
    color = '#2563eb'
  } = data;

  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const title = [jobTitle, department].filter(Boolean).join(' · ');
  const baseFont = "font-family: Arial, Helvetica, sans-serif; color: #374151; font-size: 12px;";

  const logoCell = data.logoUrl
    ? `<td style="padding-right: 16px; vertical-align: top;">${logoImg(data, 72, 6)}</td>`
    : '';

  const cell = (type, label, href) => {
    if (!label) return '';
    return `<td style="padding: 3px 12px 3px 0; ${baseFont} vertical-align: middle;">
      ${contactIcon(type, 12)}&nbsp;
      ${href ? `<a href="${escape(href)}" style="color:#374151; text-decoration:none;">${escape(label)}</a>` : escape(label)}
    </td>`;
  };

  const socials = allSocials(data, 22);

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">
  <tr>
    ${logoCell}
    <td style="vertical-align: top;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-weight: bold; color: ${escape(color)}; padding-bottom: 2px;">${escape(fullName) || '&nbsp;'}</td></tr>
        ${title ? `<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #6b7280; padding-bottom: 8px;">${escape(title)}</td></tr>` : ''}
        <tr><td style="padding: 6px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-top: 2px solid ${escape(color)}; width: 40px;"><tr><td>&nbsp;</td></tr></table>
        </td></tr>
        <tr><td style="padding-top: 4px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              ${cell('mail',  email,  email ? `mailto:${email}` : '')}
              ${cell('phone', phone,  phone ? telHref(phone) : '')}
            </tr>
            <tr>
              ${cell('mobile', mobile,   mobile ? telHref(mobile) : '')}
              ${cell('web',    website,  website ? ensureProtocol(website) : '')}
            </tr>
            ${website2 ? `<tr>${cell('web', website2, ensureProtocol(website2))}</tr>` : ''}
          </table>
        </td></tr>
        ${socials ? `<tr><td style="padding-top: 10px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${socials}</tr></table></td></tr>` : ''}
      </table>
    </td>
  </tr>
</table>`;
}

// ==================== THEME 3: MINIMAL ====================
function buildMinimal(data) {
  const {
    firstName = '', lastName = '', jobTitle = '', department = '',
    email = '', phone = '', website = '', website2 = '',
    linkedin = '', twitter = '', instagram = '', youtube = ''
  } = data;

  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const title = [jobTitle, department].filter(Boolean).join(', ');

  const link = (label, href) =>
    `<a href="${escape(href)}" style="color: #0066cc; text-decoration: none;">${escape(label)}</a>`;

  const contacts = [
    email    && link(email,    `mailto:${email}`),
    phone    && link(phone,    telHref(phone)),
    website  && link(website,  ensureProtocol(website)),
    website2 && link(website2, ensureProtocol(website2))
  ].filter(Boolean);

  const socials = [
    linkedin  && link('linkedin',  ensureProtocol(linkedin)),
    twitter   && link('x',         ensureProtocol(twitter)),
    instagram && link('instagram', ensureProtocol(instagram)),
    youtube   && link('youtube',   ensureProtocol(youtube))
  ].filter(Boolean);

  const baseFont = "font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #1f2937; line-height: 1.6;";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="${baseFont}">
  <tr><td><strong>${escape(fullName) || '&nbsp;'}</strong>${title ? ` — ${escape(title)}` : ''}</td></tr>
  ${contacts.length ? `<tr><td style="padding-top: 6px;">${contacts.join(' &nbsp;·&nbsp; ')}</td></tr>` : ''}
  ${socials.length  ? `<tr><td style="padding-top: 4px; font-size: 11px; color: #6b7280;">${socials.join(' &nbsp;·&nbsp; ')}</td></tr>` : ''}
</table>`;
}

// ==================== THEME 4: BANNER ====================
function buildBanner(data) {
  const {
    firstName = '', lastName = '', jobTitle = '', department = '',
    email = '', phone = '', mobile = '', website = '', website2 = '',
    color = '#1e40af'
  } = data;

  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const title = [jobTitle, department].filter(Boolean).join(' · ');
  const baseFont = "font-family: Arial, Helvetica, sans-serif; color: #374151; font-size: 12px;";

  const logoCell = data.logoUrl
    ? `<td style="padding-right: 12px; vertical-align: middle;">${logoImg(data, 56, 4)}</td>`
    : '';

  const row = (type, label, href) => {
    if (!label) return '';
    return `<tr><td style="${baseFont} padding: 2px 0;">
      ${contactIcon(type, 13)}&nbsp;&nbsp;${href ? `<a href="${escape(href)}" style="color:#374151; text-decoration:none;">${escape(label)}</a>` : escape(label)}
    </td></tr>`;
  };

  const socials = allSocials(data, 22);

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="max-width:520px; border-collapse: separate;">
  <tr><td style="background-color: ${escape(color)}; padding: 14px 20px; border-radius: 6px 6px 0 0;" bgcolor="${escape(color)}">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        ${logoCell}
        <td style="vertical-align: middle;">
          <div style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; margin: 0;">${escape(fullName) || '&nbsp;'}</div>
          ${title ? `<div style="font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #ffffff; opacity: 0.9; margin-top: 2px;">${escape(title)}</div>` : ''}
        </td>
      </tr>
    </table>
  </td></tr>
  <tr><td style="padding: 12px 20px; background-color: #f8fafc;" bgcolor="#f8fafc">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      ${row('mail',   email,    email ? `mailto:${email}` : '')}
      ${row('phone',  phone,    phone ? telHref(phone) : '')}
      ${row('mobile', mobile,   mobile ? telHref(mobile) : '')}
      ${row('web',    website,  website ? ensureProtocol(website) : '')}
      ${row('web',    website2, website2 ? ensureProtocol(website2) : '')}
    </table>
  </td></tr>
  ${socials ? `<tr><td style="padding: 0 20px 14px 20px; background-color: #f8fafc; border-radius: 0 0 6px 6px;" bgcolor="#f8fafc">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${socials}</tr></table>
  </td></tr>` : ''}
</table>`;
}

// ==================== THEME 5: COMPACT ====================
function buildCompact(data) {
  const {
    firstName = '', lastName = '', jobTitle = '', department = '',
    email = '', phone = '', website = '',
    color = '#059669'
  } = data;

  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const title = [jobTitle, department].filter(Boolean).join(' ');
  const baseFont = "font-family: Arial, Helvetica, sans-serif; color: #374151; font-size: 11px;";

  const logoCell = data.logoUrl
    ? `<td style="padding-right: 12px; vertical-align: middle;">${logoImg(data, 48, 4)}</td>`
    : '';

  const socials = allSocials(data, 20);

  const contactLine = [
    email   && `<a href="mailto:${escape(email)}" style="color:#0066cc; text-decoration:none;">${escape(email)}</a>`,
    phone   && `<a href="${telHref(phone)}" style="color:#0066cc; text-decoration:none;">${escape(phone)}</a>`,
    website && `<a href="${escape(ensureProtocol(website))}" style="color:#0066cc; text-decoration:none;">${escape(website)}</a>`
  ].filter(Boolean).join(' &nbsp;·&nbsp; ');

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="${baseFont}">
  <tr>
    ${logoCell}
    <td style="vertical-align: middle; padding-right: 10px;">
      <div style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; font-weight: bold; color: ${escape(color)};">${escape(fullName) || '&nbsp;'}</div>
      ${title ? `<div style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; color: #6b7280;">${escape(title)}</div>` : ''}
    </td>
    <td style="vertical-align: middle; padding: 0 10px; border-left: 1px solid #e5e7eb; ${baseFont}">
      ${contactLine}
    </td>
    ${socials ? `<td style="vertical-align: middle; padding-left: 10px; border-left: 1px solid #e5e7eb;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${socials}</tr></table>
    </td>` : ''}
  </tr>
</table>`;
}
