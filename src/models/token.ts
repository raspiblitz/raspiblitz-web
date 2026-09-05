export interface TokenPayload {
  user_id: string;
  exp: number; // expiry (unix time, seconds)
}
