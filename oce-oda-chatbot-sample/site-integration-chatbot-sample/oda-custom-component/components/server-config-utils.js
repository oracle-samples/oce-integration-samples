/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

const { createDeliveryClient } = require('@oracle/content-management-sdk');

var authValue;

function beforeSendCallback(param) {
  param.headers = param.headers || {};
  param.headers.authorization = authValue;
}

/**
 * Creates a ContentSDK Delivery Client.
 */

function getDeliveryClient(accessToken) {
  // Create an object with the keys the ContentSDK is expecting
  // with the values for the Oracle Content Management server to use in this application

  const serverconfig = {
    contentServer: 'https://samples-oce0001.cec.ocp.oraclecloud.com',
    contentVersion: 'v1.1',
    channelToken: '1258596e3dfd4c34808f0af68f39d76e',
  };

  // If accessToken is not empty, the OCM channel is secure.
  // Pass appropriate settings to access secure channel

  if (accessToken) {
    authValue = `Bearer ${accessToken}`;

    serverconfig.beforeSend = beforeSendCallback;
    serverconfig.authorization = authValue;
  }

  // Obtain the delivery client from the Content Delivery SDK
  // using the specified configuration information

  const deliveryClient = createDeliveryClient(serverconfig);

  return deliveryClient;
}

module.exports = getDeliveryClient;
