import { IGNORE_ENABLED_KEY } from '../scripts/cacheKeys.js';

(async () => {
  const $switch = document.querySelector("#swithTemplate").content.cloneNode(true);
  const $checkbox = $switch.querySelector("#switchInput");

  $checkbox.addEventListener('change', (event) => {
    chrome.storage.local.set({ [STORAGE_KEY]: event.currentTarget.checked});
  });

  const cache = await chrome.storage.local.get(IGNORE_ENABLED_KEY);
  
  if (cache && cache[STORAGE_KEY] !== undefined) {
    $checkbox.checked = cache[STORAGE_KEY];
  } else {
    $checkbox.checked = true;
    chrome.storage.local.set({ [STORAGE_KEY]: true});
  } 

  document.body.appendChild($switch);
})();
