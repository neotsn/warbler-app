export const Request = {
  /**
   * Build a recursive query string from an object
   * @param {Object} reqObject The Request Object to iterate
   * @param {string} prefix If this is a nested object, pass the prefix for this parent property on recursion
   * @returns {string} An &-separated set of key=value pairs. Does NOT include the leading '?'
   */
  buildRequestParams: ({ reqObject, prefix = null } = {}) => {
    const params = [];
    Object.keys(reqObject).forEach((property) => {
      const key = (prefix) ? `${prefix}[${property}]` : property;
      const value = reqObject[property];

      params.push((value !== null && typeof value === 'object') ? Request.buildRequestParams(value, key) : `${key}=${encodeURIComponent(value)}`);
    });
    return params.join('&');
  },

  /**
   * Generate a URL string with the host, URI, appending any request params, and adding an Anchor to the end
   * @param host
   * @param uri
   * @param requestParams
   * @param anchor
   */
  makeUrl: ({
    host = '',
    uri = '',
    requestParams = {},
    anchor = ''
  } = {}) => {
    let url = `${host}${uri}`;
    if (Object.keys(requestParams).length) {
      url += `?${Request.buildRequestParams({ reqObject: requestParams })}`;
    }
    if (anchor.length) {
      url += `#${anchor}`;
    }

    return url;
  }
};
