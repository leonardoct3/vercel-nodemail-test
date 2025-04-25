import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields required' });
  }

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  const emailContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #4CAF50;">New Contact Request</h2>
      <p><strong>Nome do Contatante:</strong> ${name}</p>
      <p><strong>Email do Contatante:</strong> ${email}</p>
      <p><strong>Resposta da pergunta:</strong></p>
      <p style="background: #f9f9f9; padding: 10px; border-left: 4px solid #4CAF50;">${message}</p>
      <hr>
      <p style="font-size: 0.9em; color: #555;">This email was sent from your website's contact form.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `Contact Request from ${name} - <${email}>`,
      text: message, // Plain text fallback
      html: emailContent, // Styled HTML content
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
