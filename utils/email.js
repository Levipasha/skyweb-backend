const nodemailer = require('nodemailer');

let cachedTransporter = null;
let verifiedOnce = false;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
  } = process.env;

  // Default to Gmail SMTP if only user/pass provided
  const host = SMTP_HOST || 'smtp.gmail.com';
  const port = Number(SMTP_PORT || 465);
  const secure = String(SMTP_SECURE || 'true') === 'true' || port === 465;

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return cachedTransporter;
}

function buildBaseHtml({ title, bodyHtml }) {
  const brandColor = '#2563eb';
  const logoUrl = process.env.SMTP_LOGO_URL || 'https://www.skywebdev.xyz/favicon.png';
  const embedLogo = String(process.env.SMTP_EMBED_LOGO || 'true') === 'true';
  const logoSrc = embedLogo ? 'cid:skyweb-logo' : logoUrl;

  return `
  <!doctype html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>${title}</title>
      <style>
        body { background: #f6f9fc; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif; color: #111827; }
        .container { max-width: 560px; margin: 24px auto; padding: 0 16px; }
        .card { background: #ffffff; border-radius: 14px; box-shadow: 0 10px 20px rgba(0,0,0,0.06); overflow: hidden; }
        .header { padding: 20px 24px; border-bottom: 1px solid #eef2f7; display: flex; align-items: center; gap: 12px; }
        .header img { height: 36px; width: 36px; border-radius: 8px; }
        .brand { font-weight: 700; font-size: 16px; color: ${brandColor}; letter-spacing: 0.2px; }
        .title { font-size: 18px; font-weight: 700; margin: 0; color: #111827; }
        .content { padding: 20px 24px; font-size: 14px; line-height: 1.6; color: #374151; }
        .divider { height: 1px; background: #f1f5f9; margin: 16px 0; }
        .footer { padding: 16px 24px; background: #f9fafb; color: #6b7280; font-size: 12px; }
        .btn { display: inline-block; background: ${brandColor}; color: #fff; padding: 10px 14px; border-radius: 10px; text-decoration: none; font-weight: 600; }
        .muted { color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <img src="${logoSrc}" alt="SkyWeb" />
            <div class="brand">SkyWeb</div>
          </div>
          <div class="content">
            ${bodyHtml}
          </div>
          <div class="footer">
            <div>SkyWeb • Thank you for applying</div>
            <div class="muted">This is an automated message. Replies are not monitored.</div>
          </div>
        </div>
      </div>
    </body>
  </html>`;
}

async function sendMail({ to, subject, html, text }) {
  const transporter = getTransporter();

  const fromName = process.env.SMTP_FROM_NAME || 'SkyWeb Careers';
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  const attachments = [];
  const embedLogo = String(process.env.SMTP_EMBED_LOGO || 'true') === 'true';
  if (embedLogo && process.env.SMTP_LOGO_URL) {
    attachments.push({
      filename: 'logo.png',
      path: process.env.SMTP_LOGO_URL,
      cid: 'skyweb-logo',
    });
  }

  const info = await transporter.sendMail({
    from: `${fromName} <${fromEmail}>`,
    to,
    subject,
    text,
    html,
    attachments,
  });

  return info;
}

function buildAppliedEmail({ applicantName, internshipTitle, duration, location, stipend, resumeLink }) {
  const companyName = process.env.COMPANY_NAME || 'SkyWeb';
  const companySite = process.env.COMPANY_WEBSITE || 'https://www.skywebdev.xyz';
  const companyEmail = process.env.COMPANY_EMAIL || 'hello@skywebdev.xyz';
  const companyPhone = process.env.COMPANY_PHONE || '+91 00000 00000';
  const companyAddress = process.env.COMPANY_ADDRESS || '';
  const linkedin = process.env.SOCIAL_LINKEDIN || 'https://www.linkedin.com/company/skywebdev';
  const twitter = process.env.SOCIAL_TWITTER || 'https://twitter.com';
  const instagram = process.env.SOCIAL_INSTAGRAM || 'https://instagram.com';
  const whatsapp = process.env.SOCIAL_WHATSAPP || '';

  const lines = [
    `<p>Hi <strong>${applicantName}</strong>,</p>`,
    `<p>Thank you for applying for the <strong>${internshipTitle}</strong> internship at ${companyName}. We have received your application and our team will review it shortly.</p>`,
  ];

  const facts = [];
  if (duration) facts.push(`<li><strong>Duration:</strong> ${duration}</li>`);
  if (location) facts.push(`<li><strong>Location:</strong> ${location}</li>`);
  if (stipend) facts.push(`<li><strong>Stipend:</strong> ${stipend}</li>`);

  lines.push(`<ul>${facts.join('')}</ul>`);

  if (resumeLink) {
    lines.push(`<p><strong>Your Resume:</strong> <a href="${resumeLink}" target="_blank" rel="noreferrer">View on Google Drive</a></p>`);
  }

  lines.push('<div class="divider"></div>');

  // What happens next
  lines.push('<h3 class="title" style="font-size:16px;margin:0 0 8px">What happens next?</h3>');
  lines.push('<ol style="margin:0 0 12px 18px; padding:0; color:#374151">');
  lines.push('<li>Our team reviews your application and resume.</li>');
  lines.push('<li>If shortlisted, we will contact you for the next steps.</li>');
  lines.push('<li>You will receive updates over email.</li>');
  lines.push('</ol>');

  // About
  lines.push('<div class="divider"></div>');
  lines.push('<h3 class="title" style="font-size:16px;margin:0 0 8px">About us</h3>');
  lines.push(`<p>${companyName} builds modern, high‑performance web solutions for businesses and startups. Explore our services, projects, and culture.</p>`);
  lines.push(`<p><a class="btn" href="${companySite}" target="_blank" rel="noreferrer">Visit our website</a></p>`);

  // Stay connected
  lines.push('<div class="divider"></div>');
  lines.push('<h3 class="title" style="font-size:16px;margin:0 0 8px">Stay connected</h3>');
  const socials = [
    { name: 'LinkedIn', url: linkedin },
    { name: 'Twitter', url: twitter },
    { name: 'Instagram', url: instagram },
    ...(whatsapp ? [{ name: 'WhatsApp', url: whatsapp }] : []),
  ];
  const socialLinks = socials
    .filter(s => !!s.url)
    .map(s => `<a href="${s.url}" target="_blank" rel="noreferrer" style="margin-right:12px; color:#2563eb; text-decoration:none; font-weight:600">${s.name}</a>`)
    .join('');
  lines.push(`<p>${socialLinks}</p>`);

  // Contact
  lines.push('<div class="divider"></div>');
  lines.push('<h3 class="title" style="font-size:16px;margin:0 0 8px">Contact</h3>');
  lines.push(`<p class="muted">Email: <a href="mailto:${companyEmail}" style="color:#2563eb; text-decoration:none">${companyEmail}</a>${companyPhone ? ` • Phone: ${companyPhone}` : ''}${companyAddress ? `<br/>${companyAddress}` : ''}</p>`);

  lines.push('<p class="muted">You will hear from us if you are shortlisted for the next round.</p>');

  const bodyHtml = lines.join('');
  const title = 'Application received – SkyWeb Internship';
  return buildBaseHtml({ title, bodyHtml });
}

module.exports = {
  sendMail,
  buildAppliedEmail,
};

// Optional: verify transporter at startup
async function verifySmtp() {
  try {
    const transporter = getTransporter();
    if (verifiedOnce) return { ok: true, message: 'Already verified' };
    await transporter.verify();
    verifiedOnce = true;
    return { ok: true, message: 'SMTP ready to send messages' };
  } catch (err) {
    return { ok: false, message: err && err.message ? err.message : String(err) };
  }
}

module.exports.verifySmtp = verifySmtp;

function getSmtpConfigSummary() {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
  } = process.env;
  return {
    host: SMTP_HOST || 'smtp.gmail.com',
    port: Number(SMTP_PORT || 465),
    secure: String(SMTP_SECURE || 'true') === 'true' || Number(SMTP_PORT || 465) === 465,
    user: SMTP_USER || null,
    // do not expose password
    passLength: process.env.SMTP_PASS ? String(process.env.SMTP_PASS).replace(/\s+/g, '').length : 0,
    verifiedOnce,
  };
}

module.exports.getSmtpConfigSummary = getSmtpConfigSummary;


