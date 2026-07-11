import jwt from "jsonwebtoken";

export interface TokenMember {
  id: number;
  role: string;
  isFirstLogin: boolean;
}


export const generatememberToken = (member: TokenMember): string => {
  const payload = {
    id: member.id,
    role: member.role,
    isFirstLogin: member.isFirstLogin
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Erreur critique : JWT_SECRET est manquant dans le fichier .env");
  }

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRATION as string || '1h'
  } as jwt.SignOptions);
};