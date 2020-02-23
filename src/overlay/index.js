(async () => {
  const src = chrome.runtime.getURL("./src/messages/index.js");
  const { isMessage, SHOW_OVERLAY} = await import(src);

  chrome.runtime.onMessage.addListener(
    (request = {}, sender, sendResponse) => {
      if(request !== null && isMessage(SHOW_OVERLAY, request)) {
        document.body.innerHTML = `<div
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          "
        >
          Overlay
        </div>`;
      }
      return true;
    });
})();


