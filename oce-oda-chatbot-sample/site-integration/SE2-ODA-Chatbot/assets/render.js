/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

define(['knockout',
	'jquery',
	'css!./styles/design.css',
	'./chatbot/web-sdk',
	SCSRenderAPI.getThemeUrlPrefix() + "/assets/js/docsUtils.js"
], function (ko, $, css, WebSDK, docsUtils) {

	'use strict';

	// Define a Knockout ViewModel for your template
	var SampleComponentViewModel = function (args) {

		// -----------------------
		// Chatbot Configurations
		// -----------------------

		function getUserId() {
			if (!sessionStorage.sessionUserId) {
				sessionStorage.openChatVar = false;
				docsUtils.getServerInfo()
					.then((serverInfo) => {
						sessionStorage.sessionUserId = serverInfo.LocalData.dUserLoginName + "_" + createRandomUserId();
						loadChatbot();
					}).catch(function () {
						sessionStorage.sessionUserId = createRandomUserId();
						loadChatbot();
					});
			} else {
				loadChatbot();
			}
		}

		function createRandomUserId() {
			var sessionUserId = new Date().getTime().toString();
			sessionUserId += Math.random().toString(36).substring(2);
			return sessionUserId;
		}

		window.onbeforeunload = () => {
			sessionStorage.openChatVar = Bots.isChatOpened();
		}

		function loadChatbot() {
			var name = 'Bots'; // Set default reference name to 'Bots'
			let Bots;
			// SDK configuration settings
			let chatWidgetSettings = {
				URI: self.odaURI(),
				userId: sessionStorage.sessionUserId,
				storageType: 'sessionStorage',
				enableLocalConversationHistory: true,
				showPrevConvStatus: false,
				clientAuthEnabled: false,
				channelId: self.channelId(),
				openChatOnLoad: (sessionStorage.openChatVar === "true"),
				openLinksInNewWindow: false,
				disablePastActions: 'none',
				enableAttachment: false,
				enableBotAudioResponse: true, // Enables audio utterance of skill responses
				enableClearMessage: true, // Enables display of button to clear conversation
				enableSpeech: true, // Enables voice recognition
				enableTimestamp: false, // Show timestamp with each message
				speechLocale: WebSDK.SPEECH_LOCALE.EN_US, // Sets locale used to speak to the skill
				showConnectionStatus: true, // Displays current connection status on the header
				i18n: { // Provide translations for the strings used in the widget
					en: { // en locale, can be configured for any locale
						chatTitle: self.chatTitle()
					},
				},
				theme: WebSDK.THEME.REDWOOD_DARK,
			};

			var config_str = self.odaConfig();
			if (config_str !== undefined && config_str !== "") {
				let configObj = JSON.parse(config_str);
				for (var key in configObj) {
					if (configObj.hasOwnProperty(key)) {
						chatWidgetSettings[key] = configObj[key];
					}
				}
			}

			// Initialize SDK
			Bots = new WebSDK(chatWidgetSettings);
			
			var isHandled = false;
			var message = 'Hi';

			Bots.on(WebSDK.EVENT.WIDGET_OPENED, function () {
				if (!isHandled && Bots.isConnected() && !Bots.getConversationHistory().messagesCount) {
					Bots.sendMessage(message, { hidden: true });
					isHandled = true;
				}
			});

			Bots.on(WebSDK.EVENT.NETWORK, function (state) {
				if (!isHandled && Bots.isConnected() && Bots.isChatOpened() && !Bots.getConversationHistory().messagesCount) {
					Bots.sendMessage(message, { hidden: true });
					isHandled = true;
				}
			});

			// Connect to the ODA
			Bots.connect();

			// Create global object to refer Bots
			window[name] = Bots;
		}

		// -----------------------------
		// End of Chatbot Configurations
		// -----------------------------

		var self = this,
			SitesSDK = args.SitesSDK;

		// create the observables
		self.odaURI = ko.observable();
		self.channelId = ko.observable();
		self.chatTitle = ko.observable();
		self.odaConfig = ko.observable();

		self.updateCustomSettingsData = $.proxy(function (customData) {
			if (customData) {
				customData.odaURI.endsWith('/') ? self.odaURI(customData.odaURI) : self.odaURI(customData.odaURI + '/');
				self.channelId(customData.channelId);
				self.chatTitle(customData.chatTitle);
				self.odaConfig(customData.odaConfig);
				// Get user id and then load the chatbot
				getUserId();
			}
		}, self);
		self.updateSettings = function (settings) {
			if (settings.property === 'customSettingsData') {
				self.updateCustomSettingsData(settings.value);
			}
		};

		// listen for the EXECUTE ACTION request to handle custom actions
		// SitesSDK.subscribe(SitesSDK.MESSAGE_TYPES.EXECUTE_ACTION, $.proxy(self.executeActionsListener, self));
		// listen for settings update
		SitesSDK.subscribe(SitesSDK.MESSAGE_TYPES.SETTINGS_UPDATED, $.proxy(self.updateSettings, self));


		// Handle Copy Style (save customSettingsData to the clipboard)
		self.copyComponentCustomData = function () {
			return {
				odaURI: this.odaURI(),
				channelId: this.channelId(),
				chatTitle: this.chatTitle(),
				odaConfig: this.odaConfig()
			};
		};

		// Handle Paste Style (apply customSettingsData from the clipboard)
		self.pasteComponentCustomData = function (data) {
			this.odaURI(data.odaURI);
			this.channelId(data.channelId);
			this.chatTitle(data.chatTitle);
			this.odaConfig(data.odaConfig);

			// save data in page
			SitesSDK.setProperty('customSettingsData', {
				odaURI: this.odaURI(),
				channelId: this.channelId(),
				chatTitle: this.chatTitle(),
				odaConfig: this.odaConfig()
			});
		};

		// listen for COPY_CUSTOM_DATA request
		SitesSDK.subscribe(SitesSDK.MESSAGE_TYPES.COPY_CUSTOM_DATA, $.proxy(self.copyComponentCustomData, self));

		// listen for PASTE_CUSTOM_DATA request
		SitesSDK.subscribe(SitesSDK.MESSAGE_TYPES.PASTE_CUSTOM_DATA, $.proxy(self.pasteComponentCustomData, self));

		// Initialize the componentLayout & customSettingsData values
		SitesSDK.getProperty('customSettingsData', self.updateCustomSettingsData);
	};


	// ----------------------------------------------
	// Create a knockout based component implemention
	// ----------------------------------------------

	var SampleComponentImpl = function (args) {
		// Initialze the custom component
		this.init(args);
	};
	// initialize all the values within the component from the given argument values
	SampleComponentImpl.prototype.init = function (args) {
		this.createViewModel(args);
		this.createTemplate(args);
		this.setupCallbacks();
	};
	// create the viewModel from the initial values
	SampleComponentImpl.prototype.createViewModel = function (args) {
		// create the viewModel
		this.viewModel = new SampleComponentViewModel(args);
	};
	// create the template based on the initial values
	SampleComponentImpl.prototype.createTemplate = function (args) {
		// Only show the component if we're in edit mode
		if (args.viewMode !== 'edit') {
			$('#' + args.id).css('visibility', 'hidden').css('height', '0').css('display', 'none');
		}

		// create a unique ID for the div to add, this will be passed to the callback
		this.contentId = args.id + '_content_' + args.viewMode;
		// create a hidden custom component template that can be added to the DOM
		var lang_code = "";
		if (window.SCS.pageLanguageCode) {
			lang_code += window.SCS.pageLanguageCode + '/';
		}
		this.template =
			'<div id="' + this.contentId + '">' +
			'    <div style="font-size: 12px; line-height: 14px; background: #fff; color: #000;">' +
			'    	This is the Chatbot component. It is only visible in edit mode' +
			'    </div>' +
			'	<script>' +
			'		function odaCardOnClick(assetSlug) {' +
			'			location.href = window.location.origin + window.SCS.sitePrefix';
		this.template += window.SCS.pageLanguageCode ? ' + window.SCS.pageLanguageCode + "/"' : '';
		this.template += ' + assetSlug + ";"' +
			'		}' +
			'	</script>' +
			'</div>';
	};

	// setup the callbacks expected by the SDK API
	SampleComponentImpl.prototype.setupCallbacks = function () {
		// callback - render: add the component into the page
		this.render = $.proxy(function (container) {
			var $container = $(container);
			// add the custom component template to the DOM
			$container.append(this.template);
		}, this);

		// callback - update: handle property change event
		this.update = $.proxy(function (args) {
			var self = this;
			// deal with each property changed
			$.each(args.properties, function (index, property) {
				if (property) {
					if (property.name === 'customSettingsData') {
						self.viewModel.updateComponentData(property.value);
					} else if (property.name === 'componentLayout') {
						self.viewModel.updateLayout(property.value);
					}
				}
			});
		}, this);
	};

	// ----------------------------------------------
	// Create the factory object for your component
	// ----------------------------------------------
	var sampleComponentFactory = {
		createComponent: function (args, callback) {
			// return a new instance of the component
			return callback(new SampleComponentImpl(args));
		}
	};
	return sampleComponentFactory;
});
