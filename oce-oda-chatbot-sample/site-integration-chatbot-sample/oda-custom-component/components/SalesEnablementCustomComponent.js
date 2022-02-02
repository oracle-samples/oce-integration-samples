/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

const getStoryData = require('./services');
const getDeliveryClient = require('./server-config-utils');

module.exports = {
  metadata: () => ({
    name: 'com.SalesEnablementCustomComponent',
    properties: {
      variable: { required: true, type: 'string' },
      itemCategory: { required: true, type: 'string' },
      accessToken: { required: true, type: 'string' },
    },
    supportedActions: ['success', 'failure'],
  }),
  invoke: async (conversation, done) => {
    // perform conversation tasks.
    const { variable } = conversation.properties();
    const { itemCategory } = conversation.properties();
    const { accessToken } = conversation.properties();

    // the following code make content sdk calls
    const client = getDeliveryClient(accessToken);

    const items = await getStoryData(client, itemCategory).then((res) => res.items);

    conversation.variable(variable, items);
    conversation.transition('success');
    conversation.keepTurn(true);

    done();
  },
};
