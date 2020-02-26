(async () => {
  const src = chrome.runtime.getURL("./src/messages/index.js");
  const {
    isMessage,
    SHOW_OVERLAY,
    createMessage,
    SEND_INTERVAL_INFO
  } = await import(src);

  if(document.getElementById('intervalInfo') === null) {
    const overlay = document.createElement('div');
    overlay.innerHTML = `
      <input type="text" id="intervalInfo" />
      <button id="intervalInfoButton" >Send</button>`;
    overlay.id = 'timeManagmenOverlay';
    overlay.style.position = 'fixed';
    overlay.style.display = 'none';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.height = '100vh';
    overlay.style.width = '100vw';
    overlay.style.zIndex = '2147483647';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.background = 'white';
    document.body.append(overlay);
  }

  const showOverlay = () => {
    document.getElementById('timeManagmenOverlay').style.display = 'flex';
    document.getElementById('intervalInfo').focus();
  }
  const hideOverlay = () => document.getElementById('timeManagmenOverlay').style.display = 'none';

  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('./src/overlay/createEventOnUserPage.js');
  script.onload = function () { this.remove()};

  (document.head || document.documentElement).appendChild(script);

  document.addEventListener("SendIntervalInfo", () => {
    const intervalInfo = document.getElementById('intervalInfo');
    if(intervalInfo.value) {
      hideOverlay();
      chrome.runtime.sendMessage(createMessage(SEND_INTERVAL_INFO, intervalInfo.value), Function.prototype);
    }
    intervalInfo.value = '';
  });

  chrome.runtime.onMessage.addListener(
    (request = {}, sender, sendResponse) => {
      if(request !== null && isMessage(SHOW_OVERLAY, request)) {
        showOverlay()
      }
      sendResponse({});
      return true;
    });
})();
