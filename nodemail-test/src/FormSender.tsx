// src/components/ContactForm.tsx

import React, { useState } from 'react';
import styled from 'styled-components';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm = () => {
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
    <Form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required value={formData.name} onChange={handleChange} />
      <input name="email" placeholder="Email" type="email" required value={formData.email} onChange={handleChange} />
      <div className='message'>
        <p>Como tem sido sua convivência no trabalho?</p>
        <textarea name="message" placeholder="Message" required value={formData.message} onChange={handleChange} />
      </div>
      <button type="submit">Send</button>
      {status && <p>{status}</p>}
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
  margin: auto;

  .message {
    display: flex;
    flex-direction: column;
    gap: 0px;
  }

  input, textarea {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }

  button {
    padding: 10px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }

  p {
    margin-top: 10px;
    color: black;
  }

  textarea {
    font-family: inherit;
  }

  
`

export default ContactForm;
