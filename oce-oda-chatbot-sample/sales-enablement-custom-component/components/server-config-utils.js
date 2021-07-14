/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

const { createDeliveryClient } = require('@oracle/content-management-sdk');

/**
 * Creates a ContentSDK Delivery Client.
 */

function getDeliveryClient() {
  // Create an object with the keys the ContentSDK is expecting
  // with the values for the Oracle Content Management server to use in this application

  const serverconfig = {
    contentServer: 'https://samples-oce0001.cec.ocp.oraclecloud.com',
    contentVersion: 'v1.1',
    channelToken: '4b7b22ad5f5245f28579641d5489a98f',
  };

  // Obtain the delivery client from the Content Delivery SDK
  // using the specified configuration information

  const deliveryClient = createDeliveryClient(serverconfig);

  return deliveryClient;
}

module.exports = getDeliveryClient;
