import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET as string;

if (!secretKey) {
  throw new Error("Please define JWT_SECRET environment variable inside .env");
}

const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(userId: string, brawlId : string) {
  const expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, brawlId,  expiresAt });
  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.delete("brawlID");
}

export interface SessionPayload extends JWTPayload{
  userId: string;
  brawlId : string;
  expiresAt: Date;
};


export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = ""): Promise<SessionPayload | undefined> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    console.log(error, "Failed to verify session");
  }
}