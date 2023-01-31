import React from 'react';
import CryptoJS from 'crypto-js';

function queryParams(source) {
  var array = [];
  for (var key in source) {
    array.push(encodeURIComponent(key) + '=' + encodeURIComponent(source[key]));
  }
  return array.join('&');
}

export function makeRequest(endpoint, httpMethod) {
  var d = new Date();
  const baseURL = 'http://45.79.178.215/foodapp/v1.0/wc-api/v2/';
  const url = baseURL + endpoint;
  const ck = 'ck_721bee57e98cf7fafa3e757d73f90741';
  const cs = 'cs_ad7cc5bfed1097dc8b9b087c69862afc';
  const sm = 'HMAC-SHA1';
  const nc = Math.floor(Math.random() * 100000000);
  const timestamp = Math.floor(d.getTime() / 1000);
  const parameters = {
    oauth_consumer_key: ck,
    oauth_nonce: nc,
    oauth_signature_method: sm,
    oauth_timestamp: timestamp,
  };

  var param = queryParams(parameters);
  const requestString =
    httpMethod +
    '&' +
    encodeURIComponent(url) +
    '&' +
    encodeURIComponent(param);
  // console.log("sort array=" + requestString)
  // generates a encoded string, BASE64 encoded HMAC-SHA1 hash
  const encodedSignature = CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA1(requestString, cs),
  );
  // console.log(encodedSignature)
  var newParamArray = [];
  for (var key in parameters) {
    newParamArray.push(
      encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key]),
    );
  }
  newParamArray.push(
    'oauth_signature' + '=' + encodeURIComponent(encodedSignature),
  );

  const requestUrl = url + '?' + newParamArray.join('&');
  // console.log('Url:' + requestUrl)

  return requestUrl;
}
