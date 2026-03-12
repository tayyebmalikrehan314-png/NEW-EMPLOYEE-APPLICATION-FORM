const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Nodemailer transporter setup (Gmail)
let transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error('Nodemailer error:', error);
  } else {
    console.log('✅ Server ready! Nodemailer configured.');
  }
});

// POST /api/submit - Handle form submission
app.post('/api/submit', async (req, res) => {
  try {
    const formData = req.body;

    // Email options
    const mailOptions = {
      from: `"Daniel's Solar Engineering" <${process.env.NODEMAILER_EMAIL}>`,
      to: process.env.NODEMAILER_EMAIL,
      subject: `🆕 New Employee Application: ${formData.fullName || 'Unnamed'}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { background: #2E7D32; color: white; padding: 20px; text-align: center; }
    .section { margin: 20px 0; padding: 15px; border-left: 4px solid #2E7D32; background: #f9f9f9; }
    .field { margin: 10px 0; }
    .label { font-weight: bold; color: #2E7D32; }
    .references { background: #e8f5e9; padding: 15px; border-radius: 8px; }
    .ref-item { margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #ddd; }
    footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #2E7D32; text-align: center; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🌞 New Employee Application</h1>
    <h2>Daniel's Solar Engineering & Design</h2>
  </div>
  
  <div class="section">
    <h3>📋 Personal Information</h3>
    <div class="field"><span class="label">Full Name:</span> ${formData.fullName || 'N/A'}</div>
    <div class="field"><span class="label">Position:</span> ${formData.position || 'N/A'}</div>
    <div class="field"><span class="label">Email:</span> ${formData.email || 'N/A'}</div>
    <div class="field"><span class="label">Mobile:</span> ${formData.mobile || 'N/A'}</div>
    <div class="field"><span class="label">Address:</span> ${formData.address || 'N/A'}</div>
    <div class="field"><span class="label">DOB:</span> ${formData.dob || 'N/A'}</div>
  </div>
  
  <div class="section">
    <h3>🎓 Education & Experience</h3>
    <div class="field"><span class="label">Education:</span> ${formData.education || 'N/A'}</div>
    <div class="field"><span class="label">Experience:</span> ${formData.experience || 'N/A'}</div>
  </div>
  
  <div class="section references">
    <h3>👥 References</h3>
    ${generateReferencesHtml(formData)}
  </div>
  
  <footer>
    <p>Application submitted via Daniel's Solar Engineering website.</p>
    <p>Timestamp: ${new Date().toLocaleString()}</p>
  </footer>
</body>
</html>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email sent for ${formData.fullName}`);
    res.json({ success: true, message: 'Application submitted successfully!' });
    
  } catch (error) {
    console.error('❌ Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send application. Please try again.' });
  }
});

// Helper function for references HTML
function generateReferencesHtml(formData) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    const name = formData[`ref${i}_name`];
    if (name) {
      html += `
        <div class="ref-item">
          <strong>${name}</strong><br>
          Mobile: ${formData[`ref${i}_mobile`] || 'N/A'}<br>
          Address: ${formData[`ref${i}_address`] || 'N/A'}<br>
          Email: ${formData[`ref${i}_email`] || 'N/A'}
        </div>`;
    }
  }
  return html || '<p>No references provided.</p>';
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 Emails sent to: ${process.env.NODEMAILER_EMAIL}`);
  console.log('💡 Edit .env with your Gmail App Password to enable emails.');
});

