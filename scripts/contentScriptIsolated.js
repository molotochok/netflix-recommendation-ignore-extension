(async () =>{
  const getVideoPlayer = () => {
    return document.querySelector('.watch-video div[data-uia="player"]');
  };

  const getMovieData = async () => {
    return new Promise(resolve => {
      const eventType = "nri_userDataResponse";
      const eventListener = (event) => {
        resolve({
          authURL: event.detail.authURL,
          guid: event.detail.userGuid,
          movieID: getVideoPlayer().getAttribute("data-videoid"),
          seriesAll:  false
        });
      };
  
      window.removeEventListener(eventType, eventListener);
      window.addEventListener(eventType, eventListener);
    
      window.dispatchEvent(new Event("nri_userDataRequest"));
    });
  }
  
  const doActionIfAtWatchVideoPage = async (action) => {
    const isWatchVideoPage = () => !!document.querySelector("html.watch-video-root");
  
    if (isWatchVideoPage()) {
      console.log("1");
      await action();
    }
  
    const observer = new MutationObserver(async _ => {
      if (isWatchVideoPage()) {
        console.log("2");
        await action();
      }
    });
  
    observer.observe(document.documentElement, { attributes: true });
  };
  
  
  const waitForPlayerToLoad = async () => {
    return new Promise(resolve => {
      const observer = new MutationObserver(_ => {
        if (!document.querySelector(".player-loading")) {
          resolve();
          observer.disconnect();
        }
      });
  
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }

  await doActionIfAtWatchVideoPage(async () => {
    await waitForPlayerToLoad();

    const requestToIgnoreMovie = () => {
      setTimeout(async () => chrome.runtime.sendMessage(await getMovieData()), 500);
    };

    new MutationObserver(() => requestToIgnoreMovie()).observe(getVideoPlayer(), { 
      attributes: true,
      attributeFilter: ['data-videoid']
    });

    requestToIgnoreMovie();
  });
})();
