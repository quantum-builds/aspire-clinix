import { customAlphabet } from "nanoid";

const JOIN_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const JOIN_CODE_LENGTH = 6;

const generateNanoid = customAlphabet(JOIN_CODE_ALPHABET, JOIN_CODE_LENGTH);

export function generateOtp(): string {
  return generateNanoid();
}
