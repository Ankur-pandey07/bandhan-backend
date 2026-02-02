const nodemailer = require("nodemailer");

let transporter = null;

/**
 * ✅ Create transporter ONLY if creds exist
 * DEV mode me email optional rakho
 */
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  transporter.verify((error) => {
    if (error) {
      console.error("❌ Email transporter error:", error.message);
    } else {
      console.log("✅ Email transporter ready");
    }
  });
} else {
  console.warn("⚠️ Email disabled (no EMAIL_USER / EMAIL_PASS)");
}

/**
 * ✅ Safe sendEmail
 * Agar transporter nahi hai → silently skip
 */
const sendEmail = async (to, subject, text) => {
  if (!transporter) {
    console.warn("📭 Email skipped (DEV mode):", subject);
    return;
  }

  await transporter.sendMail({
    from: `"Bandhan ❤️" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
