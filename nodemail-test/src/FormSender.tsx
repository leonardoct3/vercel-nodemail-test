// src/components/ContactForm.tsx

import React, { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    setStatus(data.success ? 'Email sent!' : data.error || 'Failed to send email');

    if (data.success) {
      setFormData({ name: '', email: '', message: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required value={formData.name} onChange={handleChange} />
      <input name="email" placeholder="Email" type="email" required value={formData.email} onChange={handleChange} />
      <textarea name="message" placeholder="Message" required value={formData.message} onChange={handleChange} />
      <button type="submit">Send</button>
      {status && <p>{status}</p>}
    </form>
  );
};

export default ContactForm;
