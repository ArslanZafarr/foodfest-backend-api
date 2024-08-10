export const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key';
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '15m'; // Access token expiration time
export const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || '7d'; // Refresh token expiration time
