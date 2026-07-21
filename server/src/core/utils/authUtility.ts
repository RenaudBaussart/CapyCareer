import jwt from "jsonwebtoken";

export interface TokenMember {
  id: number;
  role: string;
  isFirstLogin: boolean;
}


export const generatememberToken = (member: TokenMember ,stayLoggedIn: boolean = false): string => {
  const payload = {
    id: member.id,
    role: member.role,
    isFirstLogin: member.isFirstLogin
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Erreur critique : JWT_SECRET est manquant dans le fichier .env");
  }

  const expiration = stayLoggedIn ? process.env.JWT_LONG_EXPIRATION : process.env.JWT_EXPIRATION;
  if (!expiration) {
    throw new Error("Erreur critique : JWT_EXPIRATION ou JWT_LONG_EXPIRATION est manquant dans le fichier .env");
  }

return jwt.sign(payload, secret, {
    expiresIn: expiration
  } as jwt.SignOptions);
};