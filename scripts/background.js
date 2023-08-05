import { IGNORE_ENABLED_KEY, PREV_MOVIE_KEY } from './cacheKeys.js';

function reloadPages() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      const url = new URL(tab.url);
      if (url.hostname.startsWith("www.netflix.com")) {
        chrome.tabs.reload(tab.id);
      }
    });
  });
}

chrome.management.onEnabled.addListener(reloadPages);
chrome.management.onInstalled.addListener(reloadPages);
chrome.management.onDisabled.addListener(reloadPages);
chrome.management.onUninstalled.addListener(reloadPages);

const updateViewingActivity = async (data) => {
  return fetch("https://www.netflix.com/api/shakti/mre/viewingactivity", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(error => console.error(error));
};

chrome.runtime.onMessage.addListener(async (arg, _sender, _sendResponse) => {
  const ignoreEnabledCache = await chrome.storage.local.get(IGNORE_ENABLED_KEY);

  if (ignoreEnabledCache && (ignoreEnabledCache[IGNORE_ENABLED_KEY] === undefined || ignoreEnabledCache[IGNORE_ENABLED_KEY])) {
    await updateViewingActivity(arg);

    const prevMovieCache = await chrome.storage.local.get(PREV_MOVIE_KEY);
    chrome.storage.local.set({[PREV_MOVIE_KEY]: arg.movieID});

    if (prevMovieCache && prevMovieCache[PREV_MOVIE_KEY]) {
      arg.movieID = prevMovieCache[PREV_MOVIE_KEY];
      await updateViewingActivity(arg);
    }
  }

  return true;
});