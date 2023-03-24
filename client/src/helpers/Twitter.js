// import twitterText from 'twitter-text';
import ChirrAppUtils from './ChirrAppUtils';
import { DB_TABLES, URLS } from '../constants';
import Pgp from './Pgp';
import zlib from 'react-zlib-js';
import buffer from 'buffer';
import Database from './Database';
import Request from '../helpers/Request';

/**
 * Client-side Twitter Message processor
 */
export default class Twitter {
  static OPTION_SIGN = 'sign';

  constructor({ content, passphrase } = {}) {

    /** Set the dynamic props */
    this.content = content;
    this.passphrase = passphrase;
    this.tweets = [];
  }

  static compress(plainText) {
    const { Buffer } = buffer;
    return zlib
      .deflateSync(Buffer.from(plainText, 'utf-8'), { level: 9 })
      .toString('base64');
  }

  static decompress(b64Text) {
    const { Buffer } = buffer;
    return zlib
      .inflateSync(Buffer.from(b64Text, 'base64'))
      .toString('utf-8');
  }

  /** Sign the content, and generate a shortened verification URL */
  async generateUrl() {
    const payload = JSON.stringify({
      sig: Twitter.compress(await Pgp.createSignature({ passphrase: this.passphrase, text: this.content })),
      txt: Twitter.compress(this.content),
      pk: Twitter.compress(Database.getField({ field: DB_TABLES.PGP_PUBLIC, fromBase64: true }))
    });

    const compressed = encodeURIComponent(Twitter.compress(payload));

    return this.shortenUrl(`${URLS.CLIENT}/v/${compressed}`);
  }

  /** Sign the content, generate the verification url, and then split it into tweets */
  async processContent() {
    const prefix = `🔑 ${await this.generateUrl()} ➡️ `;
    const suffix = ` ⏹️🔑`;

    const fullContent = `${prefix}${this.content}${suffix}`;

    // console.log(fullContent);

    this.tweets = new ChirrAppUtils().split(fullContent);

    return this.tweets;
  }

  /** Send the compressed Verification URL to a shortener */
  async shortenUrl(url) {
    return fetch(Request.makeUrl({
      host: URLS.SHORTENER,
      requestParams: {
        format: 'simple',
        url: encodeURI(url)
      }
    }), { method: 'POST' });
  }
}
