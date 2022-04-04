/* eslint-disable no-param-reassign */
/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */
/**
 * This file contains a number of utility methods used to obtain data
 * from the server using the ContentSDK JavaScript Library.
 */

function dateToMDY(date) {
  const dateObj = new Date(date.value);
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };
  return dateObj.toLocaleDateString('en-US', options);
}

function createHTML(temp, fileType) {
  let obj = '';
  obj += `<div class="Bot-SE2-Story-readNext" title="${temp.title}" onclick="odaCardOnClick('${temp.slug}')" onmouseover="" style="cursor: pointer;">`;
  obj += '<div class="Bot-contentWrapper">';
  if (fileType === 'text') {
    obj += '';
  } else if (fileType === 'mp4') {
    obj += `<div class="Bot-imgDiv"><video controls><source src="${temp.url}"></video></div>`;
  } else {
    obj += `<div class="Bot-imgDiv"><img src="${temp.url}" alt="${temp.title}"></div>`;
  }
  obj += `<div class="Bot-${temp.textDiv}">`;
  obj += '<div class="Bot-AuthorTitle">';
  obj += `<div class="Bot-font14 Bot-font14-2LineEllipsis Bot-Title">${temp.title}</div>`;
  obj += '<div class="Bot-font12 Bot-Author">';
  obj += `<span class="Bot-font16-1LineEllipsis">${temp.createdbyname}</span>`;
  obj += `<span class="Bot-Date">${temp.updatedDate}</span>`;
  obj += '</div>';
  obj += '</div>';
  obj += `<div class="Bot-font12 Bot-font12-2LineEllipsis Bot-Summary">${temp.summary}</div>`;
  obj += '</div>';
  obj += '</div>';
  obj += '</div>';
  return obj;
}

function retrieveMediaURL(client, identifier) {
  return client.getItem({
    id: identifier,
    fields: 'all',
    expand: 'all',
  }).then((asset) => {
    let url = null;
    if (asset.fields && asset.fields.renditions && asset.fields.fileType !== 'mp4') {
      const object = asset.fields.renditions.filter((item) => item.name === 'Small')[0];
      const format = object.formats.filter((item) => item.format === 'jpg')[0];
      const self = format.links.filter((item) => item.rel === 'self')[0];
      var tempURL = new URL(self.href);
      url = tempURL.href.replace(tempURL.origin, "");
    } else {
      var tempURL = new URL(asset.fields.native.links[0].href);
      url = tempURL.href.replace(tempURL.origin, "");
    }
    return [url, asset.fields.fileType];
  });
}

function fetchItemsForAnnouncements(client, limit) {
  return client.getItems({
    q: '(type eq "SE2-Announcement")',
    fields: 'all',
    expand: 'all',
    limit: limit ? 4 : 100,
    totalResults: true,
  });
}

function retrieveAnnouncementsObject(client, identifier) {
  return client.getItem({
    id: identifier,
    fields: 'all',
    expand: 'all',
  }).then((asset) => {
    const temp = {};
    temp.url = '';
    temp.createdbyname = '';
    temp.updatedDate = '';
    temp.textDiv = 'NoMediaTextDiv';
    temp.title = asset.fields.title ? asset.fields.title : '';
    temp.slug = asset.slug ? `announcementdetails/${asset.slug}` : '';
    temp.summary = asset.fields.contentdescription ? asset.fields.contentdescription : '';
    temp.HTML = createHTML(temp, 'text');
    return temp;
  });
}

function fetchItemsForCategoryName(client, categoryName, limit) {
  return client.getItems({
    q: `(taxonomies.categories.name eq "${categoryName}" and type eq "SE2-Story")`,
    fields: 'all',
    expand: 'all',
    limit: limit ? 4 : 100,
    totalResults: true,
  });
}

function retrieveResultObject(client, identifier) {
  return client.getItem({
    id: identifier,
    fields: 'all',
    expand: 'all',
  }).then((asset) => {
    const temp = {};
    if (asset.fields) {
      temp.title = asset.fields.title ? asset.fields.title : '';
      temp.slug = asset.slug ? `storydetails/${asset.slug}` : '';
      temp.summary = asset.fields.summary ? asset.fields.summary : '';
      temp.createdbyname = asset.fields.createdbyname ? `by ${asset.fields.createdbyname}, ` : '';
      temp.textDiv = 'TextDiv';
      temp.updatedDate = asset.updatedDate ? dateToMDY(asset.updatedDate) : '';

      if (asset.fields.media) {
        const mediaId = asset.fields.media.id;
        return retrieveMediaURL(client, mediaId)
          .then(([url, fileType]) => {
            temp.url = url;
            temp.HTML = createHTML(temp, fileType);
            return temp;
          });
      }
    }
    return temp;
  });
}

function getStoryData(client, categoryName) {
  if (categoryName === 'Announcements') {
    return fetchItemsForAnnouncements(client, false)
      .then((topLevelItem) => {
        const { totalResults } = topLevelItem;
        const promises = [];
        // for each item, retrieve the result object and add it to the promise
        topLevelItem.items.forEach((item) => {
          promises.push(
            retrieveAnnouncementsObject(client, item.id)
              .then((resultobject) => ({ ...resultobject })),
          );
        });
        // execute all the promises before returning the data
        return Promise.all(promises)
          .then((arrayOfItems) => ({
            totalResults,
            items: arrayOfItems.flat(),
          }));
      });
  }
  return fetchItemsForCategoryName(client, categoryName, false)
    .then((topLevelItem) => {
      const { totalResults } = topLevelItem;
      const promises = [];
      // for each item, retrieve the result object and add it to the promise
      topLevelItem.items.forEach((item) => {
        promises.push(
          retrieveResultObject(client, item.id)
            .then((resultobject) => ({ ...resultobject })),
        );
      });
      // execute all the promises before returning the data
      return Promise.all(promises)
        .then((arrayOfItems) => ({
          totalResults,
          items: arrayOfItems.flat(),
        }));
    });
}

module.exports = getStoryData;
