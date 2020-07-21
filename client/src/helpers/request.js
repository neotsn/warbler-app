/**
 * Build a recursive query string from an object
 * @param {Object} reqObject The Request Object to iterate
 * @param {string} prefix If this is a nested object, pass the prefix for this parent property on recursion
 * @returns {string} An &-separated set of key=value pairs. Does NOT include the leading '?'
 */
exports.buildRequestParams = ({ reqObject, prefix = null } = {}) => {
  const params = [];
  Object.keys(reqObject).forEach((property) => {
    const key = (prefix) ? `${prefix}[${property}]` : property;
    const value = reqObject[property];

    params.push((value !== null && typeof value === 'object') ? exports.buildRequestParams(value, key) : `${key}=${encodeURIComponent(value)}`);
  });
  return params.join('&');
};

/**
 * Generate a URL string with the host, URI, appending any request params, and adding an Anchor to the end
 * @param host
 * @param uri
 * @param requestParams
 * @param anchor
 */
exports.makeUrl = ({
  host = '',
  uri = '',
  requestParams = {},
  anchor = ''
} = {}) => {
  return [
    host,
    uri,
    (requestParams.length) ? `?${exports.buildRequestParams({ reqObject: requestParams })}` : '',
    (anchor.length) ? `#${anchor}` : ''
  ].join('');
};

