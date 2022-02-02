/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

// Set client auth mode - true to enable client auth, false to disable it
const isClientAuthEnabled = false;

/**
 * Initializes the SDK and sets a global field with passed name for which
 * it can be referred to later.
 *
 * @param {string} name Name by which the chat widget should be referred
 */

const initSdk = (name) => {
  if (!name) {
    name = 'Bots'; // Set default reference name to 'Bots'
  }
  let Bots;

  setTimeout(() => {
    /**
      * SDK configuration settings
      * Other than URI, all fields are optional with two exceptions for auth modes
      * In client auth disabled mode, 'channelId' must be passed, 'userId' is optional
      * In client auth enabled mode, 'clientAuthEnabled: true' must be passed
      */
    const chatWidgetSettings = {
      URI: 'oda-7616ee2e5c994ff0875de65562b77603-da2.data.digitalassistant.oci.oraclecloud.com/',
      clientAuthEnabled: isClientAuthEnabled,
      channelId: '1fb91b19-4947-49da-a2d0-531077cc9914',
      openChatOnLoad: true,
      initUserHiddenMessage: 'Hi',
      openLinksInNewWindow: false,
      disablePastActions: 'none',
      enableAttachment: false,
      enableAutocomplete: true, // Enables autocomplete suggestions on user input
      enableBotAudioResponse: true, // Enables audio utterance of skill responses
      enableClearMessage: true, // Enables display of button to clear conversation
      enableSpeech: true, // Enables voice recognition
      enableTimestamp: false, // Show timestamp with each message
      speechLocale: WebSDK.SPEECH_LOCALE.EN_US, // Sets locale used to speak to the skill
      showConnectionStatus: true, // Displays current connection status on the header
      i18n: { // Provide translations for the strings used in the widget
        en: { // en locale, can be configured for any locale
          chatTitle: 'Sales Enablement Bot', // Set title at chat header
        },
      },
      // theme: WebSDK.THEME.CLASSIC
      // theme: WebSDK.THEME.DEFAULT
      theme: WebSDK.THEME.REDWOOD_DARK,
    };

    // Initialize SDK
    if (isClientAuthEnabled) {
      Bots = new WebSDK(chatWidgetSettings, generateToken);
    } else {
      Bots = new WebSDK(chatWidgetSettings);
    }

    // Connect to the ODA
    Bots.connect();

    // Create global object to refer Bots
    window[name] = Bots;
  }, 0);
};
