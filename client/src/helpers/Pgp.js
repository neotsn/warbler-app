import { DB_TABLES } from '../constants';
import * as openpgp from 'openpgp';
import Database from './Database';

export default class Pgp {
  static async createSignature({ passphrase, text } = {}) {
    const privateKeyArmored = Database.getField({
      field: DB_TABLES.PGP_PRIVATE,
      fromBase64: true
    });
    const privateKey = await openpgp.decryptKey({
      privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
      passphrase
    });

    const message = await openpgp.createMessage({ text });

    const detachedSignature = await openpgp.sign({
      message, // Message object
      signingKeys: privateKey,
      detached: true
    });

    return detachedSignature;
  }

  /** Requires a detatchedSignature to be provided, and technically the public key of the signer */
  static async verifySignature({ detachedSignature, text } = {}) {
    /** @note This probably needs to be fetched from a public key store instead of using local user's key */
    const publicKeyArmored = Database.getField({
      field: DB_TABLES.PGP_PUBLIC,
      fromBase64: true
    });
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
    const message = await openpgp.createMessage({ text });
    const signature = await openpgp.readSignature({ armoredSignature: detachedSignature });

    const verificationResult = await openpgp.verify({
      message, // Message object
      signature,
      verificationKeys: publicKey
    });

    const { verified, keyID } = verificationResult.signatures[0];
    try {
      await verified; // throws on invalid signature
      console.log('Signed by key id ' + keyID.toHex());
    } catch (e) {
      throw new Error('Signature could not be verified: ' + e.message);
    }
  }
}
