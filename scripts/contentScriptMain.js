(() => {
  const eventType = "nri_userDataRequest";

  const eventListener = () => {
    window.dispatchEvent(new CustomEvent("nri_userDataResponse", {
      detail: window.netflix.reactContext.models.userInfo.data
    }));
  };
  
  window.removeEventListener(eventType, eventListener);
  window.addEventListener(eventType, eventListener);
})();
