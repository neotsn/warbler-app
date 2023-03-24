import { Buffer } from 'buffer';

export default class Database {
  /** Get a value from the LocalStorage database */
  static getField({ field, fromBase64 = false, asRaw = false } = {}) {
    if (field.length) {
      const value = window.localStorage.getItem(field);

      if (typeof value !== 'undefined' && value !== null && value.length) {
        switch (true) {
          case fromBase64:
            return Buffer.from(value, 'base64').toString('utf8');
          case asRaw:
            return value;
          default:
            return JSON.parse(value);
        }
      }
      return '';
    }
    console.log('Error: No db field defined to fetch');
    return false;
  }

  /** Set a value to the LocalStorage database */
  static setField({ field, value = '', asBase64 = false } = {}) {
    if (field.length) {
      if (asBase64) {
        window.localStorage.setItem(field, Buffer.from(value).toString('base64'));
        return true;
      }
      // Store as JSON
      window.localStorage.setItem(field, JSON.stringify(value));
      return true;
    }
    console.log('Error: No db field defined to store');
    return false;
  }
}
