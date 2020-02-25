(async () => {
  const src = chrome.runtime.getURL("./src/messages/index.js");
  const { isMessage, SHOW_OVERLAY} = await import(src);

  var s = document.createElement('script');
// TODO: add "script.js" to web_accessible_resources in manifest.json
s.src = chrome.runtime.getURL('./src/overlay/test.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);

document.addEventListener("hello", function(data) {
  chrome.runtime.sendMessage("test");
});

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
          <script src="./src/overlay/test.js"></script>
          <input type="text" />
          <button onClick="sendIntervalDescription">Send</button>
        </div>`;
      }
      return true;
    });
})();


