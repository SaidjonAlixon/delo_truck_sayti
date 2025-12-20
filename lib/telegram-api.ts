const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function sendQuoteToTelegram(data: {
  fullName: string;
  phoneNumber: string;
  serviceType: string;
  additionalNotes?: string;
}) {
  const response = await fetch('/api/telegram', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to send quote request');
  }

  return response.json();
}

export async function sendContactToTelegram(data: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message?: string;
}) {
  const response = await fetch('/api/telegram', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to send contact request');
  }

  return response.json();
}

