// A hardcoded key for the simulation. In production, this would be derived securely.
const STATIC_KEY_MATERIAL = 'lendswift-secure-encryption-key-2026';

const getDerivedKey = async () => {
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(STATIC_KEY_MATERIAL),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('lendswift-salt'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
};

export const encryptData = async (data) => {
  try {
    const key = await getDerivedKey();
    const encoder = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    const encryptedContent = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(JSON.stringify(data))
    );

    // Combine IV and encrypted data for storage
    const encryptedArray = new Uint8Array(encryptedContent);
    const payload = new Uint8Array(iv.length + encryptedArray.length);
    payload.set(iv, 0);
    payload.set(encryptedArray, iv.length);

    // Convert to base64 for localstorage
    return btoa(String.fromCharCode.apply(null, payload));
  } catch (error) {
    console.error('Encryption failed', error);
    return null;
  }
};

export const decryptData = async (base64String) => {
  try {
    const key = await getDerivedKey();
    const binaryStr = atob(base64String);
    const payload = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      payload[i] = binaryStr.charCodeAt(i);
    }

    const iv = payload.slice(0, 12);
    const encryptedContent = payload.slice(12);

    const decryptedContent = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedContent
    );

    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decryptedContent));
  } catch (error) {
    console.error('Decryption failed', error);
    return null;
  }
};
