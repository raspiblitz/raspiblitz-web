export interface TokenPayload {
  user_id: string;
  iat: number; // issued at (unix time, seconds)
  exp: number; // expiry (unix time, seconds)
}
