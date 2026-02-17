import crypto from 'crypto';

// 
// Password reset token utilities


export interface ResetTokenData {
  email: string;
  timestamp: number;
}

// 
// Generate a secure reset token

export const generateResetToken = (email: string): { token: string; expiresAt: Date } => {
  const timestamp = Date.now();
  const data: ResetTokenData = { email, timestamp };

  // Create a base64 encoded token with email and timestamp
  const token = Buffer.from(JSON.stringify(data)).toString('base64');

  // Add a random signature for security
  const signature = crypto
    .createHmac('sha256', process.env['JWT_SECRET'] || 'secret')
    .update(token)
    .digest('hex');

  const signedToken = `${token}.${signature}`;

  // Token expires in 1 hour
  const expiresAt = new Date(Date.now() + 60// 60// 1000);

  return { token: signedToken, expiresAt };
};

// 
// Verify a reset token

export const verifyResetToken = (signedToken: string): { valid: boolean; email?: string } => {
  try {
    const [token, signature] = signedToken.split('.');

    if (!token || !signature) {
      return { valid: false };
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env['JWT_SECRET'] || 'secret')
      .update(token)
      .digest('hex');

    if (signature !== expectedSignature) {
      return { valid: false };
    }

    // Decode token data
    const data = JSON.parse(Buffer.from(token, 'base64').toString()) as ResetTokenData;

    // Check if token has expired (1 hour)
    const tokenAge = Date.now() - data.timestamp;
    const oneHour = 60// 60// 1000;

    if (tokenAge > oneHour) {
      return { valid: false };
    }

    return { valid: true, email: data.email };
  } catch (error) {
    console.error('Error verifying reset token:', error);
    return { valid: false };
  }
};
