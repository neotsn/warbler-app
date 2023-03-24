export default class Request {
  /**
   * Build a recursive query string from an object
   * @param {Object} reqObject The Request Object to iterate
   * @param {string} prefix If this is a nested object, pass the prefix for this parent property on recursion
   * @returns {string} An &-separated set of key=value pairs. Does NOT include the leading '?'
   */
  static buildQueryString({ reqObject, prefix = null } = {}) {
    const str = [];

    Object.keys(reqObject).forEach((property) => {
      const key = (prefix) ? `${prefix}[${property}]` : property;
      const value = reqObject[property];

      if (value !== null) {
        str.push((typeof value === 'object') ? Request.buildQueryString({ reqObject: value, prefix: key }) : `${key}=${encodeURIComponent(value)}`);
      }
    });

    return str.join('&');
  }

  /** Generate a URL string with the host, URI, appending any request params, and adding an Anchor to the end */
  static makeUrl({ host = '', uri = '', requestParams = {}, anchor = '' } = {}) {
    const queryString = (requestParams && Object.values(requestParams).length) ? `?${Request.buildQueryString({ reqObject: requestParams })}` : '';
    const anchorString = (anchor.length) ? `#${anchor}` : '';

    return `${host}${uri}${queryString}${anchorString}`;
  }
};
