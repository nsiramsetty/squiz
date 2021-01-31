import crypto from 'crypto';

export default function encodeStringToMD5(data: string): string {
  return crypto.createHash('md5').update(data).digest('hex');
}
