const fs = require('fs');
const path = require('path');
const { transporter } = require('../config/nodeMailer');
const config = require('../config/config');

const templatesDir = path.join(__dirname, '../templates/emails');
const cache = {};

const brand = {
    name: 'Coding Hubs Institute',
    supportEmail: 'info@codinghubs.in',
    phone: '+91 79735-54990',
    address: 'Main Bazar, Punjab, India',
    expiresIn: '5 minutes',
};

function readTemplate(fileName) {
    if (!cache[fileName]) {
        cache[fileName] = fs.readFileSync(path.join(templatesDir, fileName), 'utf8');
    }
    return cache[fileName];
}

function interpolate(template, vars = {}) {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => (vars[key] == null ? '' : String(vars[key])));
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function displayName(name, email) {
    const value = String(name || '').trim();
    if (value) return value;
    const local = String(email || '').split('@')[0];
    return local || 'there';
}

function renderEmail(contentFile, vars) {
    const layout = readTemplate('layout.html');
    const content = interpolate(readTemplate(contentFile), vars);
    return interpolate(layout, {
        ...brand,
        year: String(new Date().getFullYear()),
        ...vars,
        content,
    });
}

const sendEmail = async ({ to, subject, text, html }) => {
    await transporter.sendMail({
        from: config.email.from,
        to,
        subject,
        text,
        html,
    });
};

const sendLoginOtp = async (to, otp, name) => {
    const vars = {
        name: escapeHtml(displayName(name, to)),
        otp,
        expiresIn: brand.expiresIn,
        subject: 'Your Coding Hubs Institute login code',
        preheader: `Use ${otp} to sign in to the admin panel. This code expires in ${brand.expiresIn}.`,
        footerNote: 'This code is for the Coding Hubs Institute admin panel only.',
        supportEmail: brand.supportEmail,
        phone: brand.phone,
    };
    const html = renderEmail('login-otp.html', vars);
    const text = `Hello ${vars.name},\n\nYour Coding Hubs Institute admin login code is ${otp}. It expires in ${brand.expiresIn}.\n\nIf you did not try to sign in, ignore this email.\n\n${brand.name}`;
    await sendEmail({ to, subject: vars.subject, text, html });
};

const sendForgotPasswordOtp = async (to, otp, name) => {
    const vars = {
        name: escapeHtml(displayName(name, to)),
        otp,
        expiresIn: brand.expiresIn,
        subject: 'Reset your Coding Hubs Institute password',
        preheader: `Use ${otp} to reset your admin password. This code expires in ${brand.expiresIn}.`,
        footerNote: 'If you did not request a password reset, no action is needed.',
        supportEmail: brand.supportEmail,
        phone: brand.phone,
    };
    const html = renderEmail('forgot-password-otp.html', vars);
    const text = `Hello ${vars.name},\n\nYour Coding Hubs Institute password reset code is ${otp}. It expires in ${brand.expiresIn}.\n\nIf you did not ask to reset your password, ignore this email.\n\n${brand.name}`;
    await sendEmail({ to, subject: vars.subject, text, html });
};

const sendResendOtp = async (to, otp, name, purpose = 'login') => {
    const isReset = purpose === 'reset';
    const vars = {
        name: escapeHtml(displayName(name, to)),
        otp,
        expiresIn: brand.expiresIn,
        eyebrow: isReset ? 'PASSWORD RESET' : 'ADMIN SIGN IN',
        heading: isReset ? 'Your new password reset code' : 'Your new login verification code',
        intro: isReset
            ? 'Here is a new code to continue resetting your admin password.'
            : 'Here is a new code to sign in to the Coding Hubs Institute admin panel.',
        closing: isReset
            ? 'If you did not ask to reset your password, you can ignore this email.'
            : 'If you did not try to sign in, you can ignore this email.',
        subject: isReset
            ? 'Your new Coding Hubs Institute password reset code'
            : 'Your new Coding Hubs Institute login code',
        preheader: `Your new code is ${otp}. It expires in ${brand.expiresIn}.`,
        footerNote: 'This new code replaces the previous one.',
        supportEmail: brand.supportEmail,
        phone: brand.phone,
    };
    const html = renderEmail('resend-otp.html', vars);
    const text = `Hello ${vars.name},\n\n${vars.intro} Your new code is ${otp}. It expires in ${brand.expiresIn}. The previous code is no longer valid.\n\n${vars.closing}\n\n${brand.name}`;
    await sendEmail({ to, subject: vars.subject, text, html });
};

function courseSectionHtml(courseTitle) {
    if (!courseTitle) return '';
    return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px; background:#f5f7fb; border:1px solid #e4e8ef; border-radius:12px;">
  <tr>
    <td style="padding:18px 20px;">
      <p style="margin:0 0 6px; color:#1c4dfb; font-size:11px; font-weight:bold; letter-spacing:0.14em;">YOUR ENQUIRY</p>
      <p style="margin:0; color:#151b24; font-size:18px; font-weight:bold; line-height:1.4;">${escapeHtml(courseTitle)}</p>
    </td>
  </tr>
</table>`;
}

const sendResponseThankYou = async (response) => {
    const to = response?.email;
    if (!to) return;

    const courseTitle =
        response.course && typeof response.course === 'object' ? response.course.title || '' : '';
    const type = response.responseType || 'general';
    const requestLabel =
        type === 'registration' ? 'course registration' : type === 'enquiry' ? 'course enquiry' : 'message';
    const vars = {
        name: escapeHtml(displayName(response.name, to)),
        requestLabel,
        courseSection: courseSectionHtml(courseTitle),
        address: brand.address,
        subject: 'Thank you for your interest in Coding Hubs Institute',
        preheader: 'We have received your request. Our team will contact you shortly.',
        footerNote: 'This email confirms that Coding Hubs Institute has received your request.',
        supportEmail: brand.supportEmail,
        phone: brand.phone,
    };
    const html = renderEmail('response-thank-you.html', vars);
    const text = [
        `Dear ${vars.name},`,
        '',
        `Thank you for your interest in Coding Hubs Institute. We have received your ${requestLabel} and our team will contact you shortly.`,
        courseTitle ? `Course: ${courseTitle}` : '',
        '',
        `Warm regards,\nTeam ${brand.name}`,
        brand.phone,
        brand.supportEmail,
    ]
        .filter(Boolean)
        .join('\n');
    await sendEmail({ to, subject: vars.subject, text, html });
};

module.exports = {
    sendEmail,
    sendLoginOtp,
    sendForgotPasswordOtp,
    sendResendOtp,
    sendResponseThankYou,
};
