// Génère le HTML de la signature (tables-based, compatible Gmail)
// Les icônes sociales sont inline en SVG data-uri pour éviter toute dépendance externe.

const icon = (svg) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const LINKEDIN_ICON = icon(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff"><rect width="24" height="24" rx="4" fill="%%COLOR%%"/><path d="M7.1 9.3h2.6v8H7.1v-8zm1.3-3.8a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM11.3 9.3h2.5v1.1h.03c.35-.66 1.2-1.35 2.47-1.35 2.64 0 3.13 1.74 3.13 4v4.25h-2.6v-3.77c0-.9-.02-2.06-1.25-2.06-1.25 0-1.44.98-1.44 1.99v3.84h-2.6v-8z"/></svg>`
);

const TWITTER_ICON = icon(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="%%COLOR%%"/><path fill="#ffffff" d="M17.5 6.5h2.3l-5 5.73L21 18.5h-4.6l-3.6-4.7-4.13 4.7H6.37l5.36-6.12L6 6.5h4.72l3.25 4.3 3.53-4.3zm-.8 10.6h1.27L9.4 7.8H8.03l8.67 9.3z"/></svg>`
);

const INSTAGRAM_ICON = icon(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="%%COLOR%%"/><path fill="none" stroke="#ffffff" stroke-width="1.6" d="M8 5h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z"/><circle cx="12" cy="12" r="3" fill="none" stroke="#ffffff" stroke-width="1.6"/><circle cx="16.6" cy="7.4" r="0.9" fill="#ffffff"/></svg>`
);

const PHONE_ICON = icon(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%%COLOR%%" d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.3 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.3 1.1l-2.2 2.1z"/></svg>`
);

const MOBILE_ICON = icon(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%%COLOR%%" d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v14h10V4H7zm5 16a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>`
);

const MAIL_ICON = icon(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%%COLOR%%" d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11zm2.1.3 6.9 5.2 6.9-5.2a.5.5 0 0 0-.4-.8H5.5a.5.5 0 0 0-.4.8zM19 8.6l-6.4 4.85a1 1 0 0 1-1.2 0L5 8.6v8.9c0 .28.22.5.5.5h13a.5.5 0 0 0 .5-.5V8.6z"/></svg>`
);

const WEB_ICON = icon(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%%COLOR%%" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm7.9 9h-3.3a15.6 15.6 0 0 0-1.2-5.1A8 8 0 0 1 19.9 11zM12 4c.9 1.3 1.9 3.6 2.2 7h-4.4C10.1 7.6 11.1 5.3 12 4zM4.1 13h3.3a15.6 15.6 0 0 0 1.2 5.1A8 8 0 0 1 4.1 13zm0-2a8 8 0 0 1 4.5-5.1A15.6 15.6 0 0 0 7.4 11zM12 20c-.9-1.3-1.9-3.6-2.2-7h4.4c-.3 3.4-1.3 5.7-2.2 7zm3.4-1.9a15.6 15.6 0 0 0 1.2-5.1h3.3a8 8 0 0 1-4.5 5.1z"/></svg>`
);

const withColor = (dataUri, color) =>
  dataUri.replace(/%%COLOR%%/g, encodeURIComponent(color));

const ensureProtocol = (url) => {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

const escape = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export function buildSignatureHTML(data) {
  const {
    firstName = '',
    lastName = '',
    jobTitle = '',
    department = '',
    email = '',
    phone = '',
    mobile = '',
    website = '',
    linkedin = '',
    twitter = '',
    instagram = '',
    color = '#0f172a',
    logoUrl = ''
  } = data;

  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const baseFont =
    "font-family: Arial, Helvetica, sans-serif; color: #1f2937; font-size: 13px; line-height: 1.5;";

  const row = (iconUri, label, href) => {
    if (!label) return '';
    return `
      <tr>
        <td style="padding: 2px 8px 2px 0; vertical-align: middle; width: 18px;">
          <img src="${withColor(iconUri, color)}" width="14" height="14" alt="" style="display:block;border:0;" />
        </td>
        <td style="padding: 2px 0; ${baseFont}">
          ${
            href
              ? `<a href="${escape(href)}" style="color:#1f2937; text-decoration: none;">${escape(label)}</a>`
              : escape(label)
          }
        </td>
      </tr>`;
  };

  const socialCell = (iconUri, href) => {
    if (!href) return '';
    return `<td style="padding-right: 6px;">
      <a href="${escape(ensureProtocol(href))}" style="text-decoration:none;">
        <img src="${withColor(iconUri, color)}" width="24" height="24" alt="" style="display:block;border:0;border-radius:4px;" />
      </a>
    </td>`;
  };

  const socials = [
    socialCell(LINKEDIN_ICON, linkedin),
    socialCell(TWITTER_ICON, twitter),
    socialCell(INSTAGRAM_ICON, instagram)
  ].join('');

  const socialsRow = socials
    ? `<tr><td style="padding-top: 10px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${socials}</tr></table>
      </td></tr>`
    : '';

  const logoCell = logoUrl
    ? `<td style="padding-right: 20px; vertical-align: top;">
        <img src="${escape(logoUrl)}" alt="${escape(fullName)}" width="84" height="84"
             style="display:block; border:0; border-radius: 8px; object-fit: cover;" />
      </td>`
    : '';

  const title = [jobTitle, department].filter(Boolean).join(' • ');

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="${baseFont}">
  <tr>
    ${logoCell}
    <td style="vertical-align: top; border-left: 3px solid ${escape(color)}; padding-left: 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-family: Arial, Helvetica, sans-serif; font-size: 17px; font-weight: bold; color: ${escape(color)}; padding-bottom: 2px;">
            ${escape(fullName) || '&nbsp;'}
          </td>
        </tr>
        ${
          title
            ? `<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #475569; padding-bottom: 8px;">${escape(title)}</td></tr>`
            : ''
        }
        <tr><td style="padding-top: 4px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            ${row(MAIL_ICON, email, email ? `mailto:${email}` : '')}
            ${row(PHONE_ICON, phone, phone ? `tel:${phone.replace(/\s+/g, '')}` : '')}
            ${row(MOBILE_ICON, mobile, mobile ? `tel:${mobile.replace(/\s+/g, '')}` : '')}
            ${row(WEB_ICON, website, website ? ensureProtocol(website) : '')}
          </table>
        </td></tr>
        ${socialsRow}
      </table>
    </td>
  </tr>
</table>`;
}
