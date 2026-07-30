// lib/auth.js

import crypto from "crypto";


export const SESSION_COOKIE = "sro_session";

const SECRET =
  process.env.SESSION_SECRET ||
  "vibeathon-dev-secret-change-me";



export function hashPassword(password) {

  const salt =
    crypto.randomBytes(16).toString("hex");

  const hash =
    crypto
      .scryptSync(password, salt, 64)
      .toString("hex");

  return `${salt}:${hash}`;

}



export function verifyPassword(password, stored) {

  if (!stored) return false;

  const [salt, hash] =
    stored.split(":");


  const check =
    crypto
      .scryptSync(password, salt, 64)
      .toString("hex");


  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(check, "hex")
  );

}



export function sign(payloadObj) {

  const payload =
    Buffer
      .from(JSON.stringify(payloadObj))
      .toString("base64url");


  const sig =
    crypto
      .createHmac("sha256", SECRET)
      .update(payload)
      .digest("base64url");


  return `${payload}.${sig}`;

}



export function verify(token) {

  if (!token) return null;


  const [payload, sig] =
    token.split(".");


  if (!payload || !sig)
    return null;


  const expected =
    crypto
      .createHmac("sha256", SECRET)
      .update(payload)
      .digest("base64url");


  if (
    !crypto.timingSafeEqual(
      Buffer.from(sig),
      Buffer.from(expected)
    )
  ) {
    return null;
  }


  return JSON.parse(
    Buffer
      .from(payload, "base64url")
      .toString("utf8")
  );

}



export function generateOtp() {

  return String(
    crypto.randomInt(100000, 999999)
  );

}