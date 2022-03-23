/**
 * Copyright (c) 2021 Oracle and/or its affiliates. All rights reserved.
 */

/* globals define */
define([
	'jquery',
	'mustache',
	'text!./layout.html',
	'css!./design.css'
], function ($, Mustache, templateHtml, css) {
	'use strict';

	function ContentLayout(params) {
		this.contentItemData = params.contentItemData || {};
		this.scsData = params.scsData;
		this.contentClient = params.contentClient;
	}

	// Helper function to format a date field by locale.
	function dateToMDY(date) {
		var dateObj = new Date(date.value);
		var options = {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		};

		return dateObj.toLocaleDateString("en-US", options);
	}

	// Content Layout definition
	ContentLayout.prototype = {
		// Specify the versions of the Content REST API that are supported by the this Content Layout.
		// The value for contentVersion follows Semantic Versioning syntax.
		// This allows applications that use the content layout to pass the data through in the expected format.
		contentVersion: ">=1.1.0 <2.0.0",

		// Main rendering function:
		// - Updates the data to handle any required additional requests and support both v1.0 and v1.1 Content REST APIs
		// - Expand the Mustache template with the updated data
		// - Appends the expanded template HTML to the parentObj DOM element
		render: function (parentObj) {
			var content = $.extend({}, this.contentItemData),
				contentClient = this.contentClient;

			// Get the Sites contect information via the scsData property
			content = $.extend(content, {
				'scsData': this.scsData
			});

			// Get formatted date
			content.updatedDate.formatted = dateToMDY(content.updatedDate);

			// Additional work required for the fields specific to this content type
			var fields = content.fields;

			// Get blog image
			fields.blog_image_thumbnail.url = contentClient.getRenditionURL({
				'id': fields.blog_image_thumbnail.id
			});

			// Append HTML to DOM
			try {
				// Use Mustache to expand the HTML template with the data.
				var template = Mustache.render(templateHtml, content);

				// Insert the expanded template into the passed in container
				$(parentObj).append(template);
			} catch (err) {
				console.error("Unable to render content:", err);
			}
		}
	};

	return ContentLayout;
});