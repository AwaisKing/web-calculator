/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

'use strict';


const PrecacheConfig              = [
    ["index.html", "af9d0c6fd97447972ebfe8802c44c85e"],

    ["assets/style/calculator-style.css", "975047a7fff685ce74f8dcf729e223b8"],

    ["assets/scripts/change-calculator-theme.js", "e3171218ba25f87730a176fe0fc9ef5b"],
    ["assets/scripts/operations-calculator.js", "0f464f35b460f8190c0214517e1ce007"],
    ["assets/scripts/offline-register.js", "8312bd94025cb4c84b41ec4a78487067"],
];
const CacheNamePrefix             = 'sw-precache-v1--' + (self.registration ? self.registration.scope : '') + '-';
const IgnoreUrlParametersMatching = [/./];


const addDirectoryIndex         = (originalUrl, index) => {
    let url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') url.pathname += index;
    return url.toString();
};
const populateCurrentCacheNames = (precacheConfig, cacheNamePrefix, baseUrl) => {
    let absoluteUrlToCacheName         = {};
    let currentCacheNamesToAbsoluteUrl = {};

    precacheConfig.forEach(cacheOption => {
        let absoluteUrl                           = new URL(cacheOption[0], baseUrl).toString();
        let cacheName                             = cacheNamePrefix + absoluteUrl + '-' + cacheOption[1];
        currentCacheNamesToAbsoluteUrl[cacheName] = absoluteUrl;
        absoluteUrlToCacheName[absoluteUrl]       = cacheName;
    });

    return {
        absoluteUrlToCacheName        : absoluteUrlToCacheName,
        currentCacheNamesToAbsoluteUrl: currentCacheNamesToAbsoluteUrl,
    };
};
const stripIgnoredUrlParameters = (originalUrl, ignoreUrlParametersMatching) => {
    let url = new URL(originalUrl);

    url.search = url.search
        // Exclude initial '?'
                    .slice(1)
        // Split into an array of 'key=value' strings
                    .split('&')
        // Split each 'key=value' string into a [key, value] array
                    .map(kv => kv.split('='))
        // Return true iff the key doesn't match any of the regexes.
                    .filter(kv => ignoreUrlParametersMatching.every(ignoredRegex => !ignoredRegex.test(kv[0])))
        // Join each [key, value] array into a 'key=value' string
                    .map(kv => kv.join('='))
        // Join the array of 'key=value' strings into a string with '&' in between each
                    .join('&');

    return url.toString();
};

const mappings                       = populateCurrentCacheNames(PrecacheConfig, CacheNamePrefix, self.location);
const AbsoluteUrlToCacheName         = mappings.absoluteUrlToCacheName;
const CurrentCacheNamesToAbsoluteUrl = mappings.currentCacheNamesToAbsoluteUrl;

const deleteAllCaches = () => caches.keys().then(cacheNames => Promise.all(cacheNames.map(cacheName => caches.delete(cacheName))));


if (self.clients && (typeof self.clients.claim === 'function')) {
    self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });
}

self.addEventListener('install', event => {
    let now = Date.now();
    event.waitUntil(caches.keys().then(allCacheNames => Promise.all(
        Object.keys(CurrentCacheNamesToAbsoluteUrl)
              .filter(cacheName => allCacheNames.indexOf(cacheName) === -1)
              .map(cacheName => {
                  let url = new URL(CurrentCacheNamesToAbsoluteUrl[cacheName]);
                  // Put in a cache-busting parameter to ensure we're caching a fresh response.
                  if (url.search) url.search += '&';
                  url.search += 'sw-precache=' + now;
                  let urlWithCacheBusting = url.toString();

                  console.log('Adding URL "%s" to cache named "%s"', urlWithCacheBusting, cacheName);

                  return caches.open(cacheName).then(cache => {
                      let request = new Request(urlWithCacheBusting, {credentials: 'same-origin'});
                      return fetch(request.clone()).then(response => {
                          if (response.ok) return cache.put(request, response);
                          console.error('Request for %s returned a response with status %d, so not attempting to cache it.', urlWithCacheBusting, response.status);
                          // Get rid of the empty cache if we can't add a successful response to it.
                          return caches.delete(cacheName);
                      });
                  });
              }),
    ).then(() => Promise.all(
        allCacheNames.filter(cacheName => cacheName.indexOf(CacheNamePrefix) === 0 &&
                                          !(cacheName in CurrentCacheNamesToAbsoluteUrl)).map(cacheName => {
            console.log('Deleting out-of-date cache "%s"', cacheName);
            return caches.delete(cacheName);
        }),
    ))).then(() => {
        if (typeof self.skipWaiting === 'function')
            // Force the SW to transition from installing -> active state
            self.skipWaiting();
    }));
});
self.addEventListener('message', event => {
    if (event.data.command === 'delete_all') {
        console.log('About to delete all caches...');
        deleteAllCaches().then(() => {
            console.log('Caches deleted.');
            event.ports[0].postMessage({error: null});
        }).catch(error => {
            console.log('Caches not deleted:', error);
            event.ports[0].postMessage({error: error});
        });
    }
});
self.addEventListener('fetch', event => {
    if (event.request.method === 'GET') {
        let urlWithoutIgnoredParameters = stripIgnoredUrlParameters(event.request.url, IgnoreUrlParametersMatching);

        let cacheName      = AbsoluteUrlToCacheName[urlWithoutIgnoredParameters];
        let directoryIndex = 'index.html';
        if (!cacheName && directoryIndex) {
            urlWithoutIgnoredParameters = addDirectoryIndex(urlWithoutIgnoredParameters, directoryIndex);
            cacheName                   = AbsoluteUrlToCacheName[urlWithoutIgnoredParameters];
        }

        if (cacheName) {
            // We can't call cache.match(event.request) since the entry in the cache will contain the
            // cache-busting parameter. Instead, rely on the fact that each cache should only have one
            // entry, and return that.
            event.respondWith(caches.open(cacheName).then(cache => cache.keys().then(keys =>
                cache.match(keys[0]).then(response => response || fetch(event.request).catch(e => {
                    console.error('Fetch for "%s" failed: %O', urlWithoutIgnoredParameters, e);
                })))).catch(e => {
                console.error('Couldn\'t serve response for "%s" from cache: %O', urlWithoutIgnoredParameters, e);
                return fetch(event.request);
            }));
        }
    }
});