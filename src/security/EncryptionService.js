// =====================================================================================
// 🔐 ENCRYPTION SERVICE - AES-256 ENCRYPTION
// =====================================================================================
// FILE LOCATION: src/security/EncryptionService.js
// Created by Himanshu (himanshu1614)
// Purpose: Military-grade encryption for all user data

class EncryptionService {
  constructor() {
    this.algorithm = 'AES-GCM';
    this.keyLength = 256;
    this.ivLength = 12; // 96 bits for GCM
    this.tagLength = 16; // 128 bits
    this.isInitialized = false;
    
    this.initialize();
  }

  async initialize() {
    try {
      // Check for Web Crypto API support
      if (!window.crypto || !window.crypto.subtle) {
        throw new Error('Web Crypto API not supported');
      }
      
      this.isInitialized = true;
      console.log('🔐 Encryption service initialized with AES-256-GCM');
      
    } catch (error) {
      console.error('Encryption service initialization failed:', error);
      this.isInitialized = false;
    }
  }

  // =====================================================================================
  // 🔑 KEY GENERATION
  // =====================================================================================

  async generateKey() {
    try {
      const key = await window.crypto.subtle.generateKey(
        {
          name: this.algorithm,
          length: this.keyLength
        },
        true, // extractable
        ['encrypt', 'decrypt']
      );
      
      return { success: true, key };
    } catch (error) {
      console.error('Key generation failed:', error);
      return { success: false, error: error.message };
    }
  }

  async deriveKeyFromPassword(password, salt) {
    try {
      // Convert password to key material
      const encoder = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );

      // Derive actual encryption key
      const key = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000, // 100k iterations for security
          hash: 'SHA-256'
        },
        keyMaterial,
        {
          name: this.algorithm,
          length: this.keyLength
        },
        true,
        ['encrypt', 'decrypt']
      );

      return { success: true, key };
    } catch (error) {
      console.error('Key derivation failed:', error);
      return { success: false, error: error.message };
    }
  }

  generateSalt() {
    return window.crypto.getRandomValues(new Uint8Array(32)); // 256-bit salt
  }

  generateIV() {
    return window.crypto.getRandomValues(new Uint8Array(this.ivLength));
  }

  // =====================================================================================
  // 🔒 ENCRYPTION
  // =====================================================================================

  async encryptData(data, key = null) {
    try {
      if (!this.isInitialized) {
        throw new Error('Encryption service not initialized');
      }

      // Use provided key or generate new one
      let encryptionKey = key;
      if (!encryptionKey) {
        const keyResult = await this.generateKey();
        if (!keyResult.success) {
          throw new Error('Failed to generate encryption key');
        }
        encryptionKey = keyResult.key;
      }

      // Convert data to string if needed
      const dataString = typeof data === 'string' ? data : JSON.stringify(data);
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(dataString);

      // Generate random IV for this encryption
      const iv = this.generateIV();

      // Encrypt the data
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
          name: this.algorithm,
          iv: iv
        },
        encryptionKey,
        dataBuffer
      );

      // Export key for storage (if we generated it)
      let exportedKey = null;
      if (!key) {
        const keyExport = await window.crypto.subtle.exportKey('raw', encryptionKey);
        exportedKey = Array.from(new Uint8Array(keyExport));
      }

      // Combine IV and encrypted data
      const encryptedArray = new Uint8Array(encryptedBuffer);
      const combined = new Uint8Array(iv.length + encryptedArray.length);
      combined.set(iv);
      combined.set(encryptedArray, iv.length);

      return {
        success: true,
        encrypted: {
          data: Array.from(combined),
          key: exportedKey,
          algorithm: this.algorithm,
          timestamp: Date.now()
        }
      };

    } catch (error) {
      console.error('Encryption failed:', error);
      return { success: false, error: error.message };
    }
  }

  // =====================================================================================
  // 🔓 DECRYPTION
  // =====================================================================================

  async decryptData(encryptedData, key = null) {
    try {
      if (!this.isInitialized) {
        throw new Error('Encryption service not initialized');
      }

      // Get encryption key
      let decryptionKey = key;
      if (!decryptionKey && encryptedData.key) {
        // Import key from stored data
        const keyArray = new Uint8Array(encryptedData.key);
        decryptionKey = await window.crypto.subtle.importKey(
          'raw',
          keyArray,
          { name: this.algorithm },
          false,
          ['decrypt']
        );
      }

      if (!decryptionKey) {
        throw new Error('No decryption key available');
      }

      // Extract IV and encrypted data
      const combinedArray = new Uint8Array(encryptedData.data);
      const iv = combinedArray.slice(0, this.ivLength);
      const encryptedArray = combinedArray.slice(this.ivLength);

      // Decrypt the data
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: this.algorithm,
          iv: iv
        },
        decryptionKey,
        encryptedArray
      );

      // Convert back to string
      const decoder = new TextDecoder();
      const decryptedString = decoder.decode(decryptedBuffer);

      // Try to parse as JSON, fallback to string
      let decryptedData;
      try {
        decryptedData = JSON.parse(decryptedString);
      } catch {
        decryptedData = decryptedString;
      }

      return {
        success: true,
        data: decryptedData
      };

    } catch (error) {
      console.error('Decryption failed:', error);
      return { success: false, error: error.message };
    }
  }

  // =====================================================================================
  // 🛡️ SECURE HASHING
  // =====================================================================================

  async hashData(data, algorithm = 'SHA-256') {
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(typeof data === 'string' ? data : JSON.stringify(data));
      
      const hashBuffer = await window.crypto.subtle.digest(algorithm, dataBuffer);
      const hashArray = new Uint8Array(hashBuffer);
      
      // Convert to hex string
      const hashHex = Array.from(hashArray)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      return { success: true, hash: hashHex };
    } catch (error) {
      console.error('Hashing failed:', error);
      return { success: false, error: error.message };
    }
  }

  // =====================================================================================
  // 🎲 SECURE RANDOM GENERATION
  // =====================================================================================

  generateSecureId(length = 32) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    
    // Convert to base64url (URL-safe)
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  generateSecurePin(length = 6) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    
    // Convert to numeric PIN
    return Array.from(array)
      .map(byte => byte % 10)
      .join('');
  }

  // =====================================================================================
  // 🔍 UTILITY METHODS
  // =====================================================================================

  async verifyIntegrity(data, expectedHash) {
    const hashResult = await this.hashData(data);
    if (!hashResult.success) {
      return { valid: false, error: 'Hash generation failed' };
    }
    
    return {
      valid: hashResult.hash === expectedHash,
      hash: hashResult.hash
    };
  }

  secureCompare(a, b) {
    // Constant-time string comparison to prevent timing attacks
    if (a.length !== b.length) {
      return false;
    }
    
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    
    return result === 0;
  }

  // =====================================================================================
  // 📊 SERVICE STATUS
  // =====================================================================================

  getStatus() {
    return {
      isInitialized: this.isInitialized,
      algorithm: this.algorithm,
      keyLength: this.keyLength,
      supported: !!(window.crypto && window.crypto.subtle),
      features: {
        encryption: true,
        keyGeneration: true,
        keyDerivation: true,
        hashing: true,
        secureRandom: true
      }
    };
  }
}

// Export singleton instance
const encryptionService = new EncryptionService();
export default encryptionService;