import { STORAGE_KEY } from '../constants.js';

(function() {
  const $switch = document.querySelector("#swithTemplate").content.cloneNode(true);
  const $checkbox = $switch.querySelector("#switchInput");

  $checkbox.addEventListener('change', (event) => {
    chrome.storage.local.set({ [STORAGE_KEY]: event.currentTarget.checked});
  });

  chrome.storage.local.get(STORAGE_KEY).then(cache => {
    if (cache && cache[STORAGE_KEY] !== undefined) {
      $checkbox.checked = cache[STORAGE_KEY];
    } else {
      $checkbox.checked = true;
      chrome.storage.local.set({ [STORAGE_KEY]: true});
    } 

    document.body.appendChild($switch);
  });
})();
