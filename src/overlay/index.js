window.onload = () => (async () => {
  const src = chrome.runtime.getURL("./src/messages/index.js");
  const {
    isMessage,
    SHOW_OVERLAY,
    createMessage,
    SEND_INTERVAL_INFO
  } = await import(src);
  

  if(document.getElementById('intervalInfo') === null) {
    document.body.innerHTML += `<div
      style="
        position: fixed;
        display: none;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
        z-index: 2147483647;
        top: 0;
        left: 0;
        background: white;
      "
      id="timeManagmenOverlay"
    >
      <input type="text" id="intervalInfo" />
      <button id="intervalInfoButton" >Send</button>
    </div>`;
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
      return true;
    });
})();
