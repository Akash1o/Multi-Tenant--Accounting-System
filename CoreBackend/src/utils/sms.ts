import axios from 'axios';

export const sendSMS = async (phone: string, message: string): Promise<void> => {
  try {
    await axios.post('https://textbelt.com/text', {
      phone: `+977${phone}`,  // Nepal country code
      message,
      key: 'textbelt'
    });
    console.log('SMS sent to', phone);
  } catch (error) {
    console.error('SMS failed:', error);
  }
};