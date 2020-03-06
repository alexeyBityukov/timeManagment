(async () => {
  const src = chrome.runtime.getURL("./src/messages/index.js");
  const {
    isMessage,
    SHOW_OVERLAY,
    createMessage,
    SEND_INTERVAL_INFO
  } = await import(src);

  const getLastIntervalDescription = () => new Promise((resolve) => {
    chrome.storage.local.get('intervalLog', ({ intervalLog }) => {
      if(intervalLog.length === 0)
        resolve('');
      else 
        resolve(intervalLog[intervalLog.length - 1].description);
    });
  });

  if(document.getElementById('intervalInfo') === null) {
    const overlay = document.createElement('div');
    overlay.innerHTML = `
      <div>
        <div class="setNewInterval">
          <input type="text" id="intervalInfo" />
          <button id="intervalInfoButton" >Send</button>
        </div>
        <div class="wrapPrevIntervalDescription">
          <a class="prevIntervalDescription">${await getLastIntervalDescription()}</a>
        </div>
      </div>`;
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
    const prevIntervalElemWrap = document.getElementsByClassName('wrapPrevIntervalDescription')[0];
    prevIntervalElemWrap.style.paddingTop = '10px';
    prevIntervalElemWrap.style.textAlign = 'center';
    const prevIntervalElem = document.getElementsByClassName('prevIntervalDescription')[0];

    const setDefaultStyle = (elem) => {
      elem.style.color = '#1a0dab';
      elem.style.cursor = 'default';
      elem.style.textDecoration = 'none';
    }
    
    setDefaultStyle(prevIntervalElem);

    prevIntervalElem.onmouseover = ({ target }) => {
      target.style.color = '#1a0dab';
      target.style.cursor = 'pointer';
      target.style.textDecoration = 'underline';
    };
    
    prevIntervalElem.onmouseout = ({ target }) => {
      setDefaultStyle(target);
    };
  }

  const showOverlay = async () => {
    document.getElementById('timeManagmenOverlay').style.display = 'flex';
    document.getElementById('intervalInfo').focus();
    document.getElementsByClassName('prevIntervalDescription')[0].textContent = await getLastIntervalDescription();
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

  document.addEventListener("sendIntervalFromPrev", async () => {
    const lastIntervalDescription = await getLastIntervalDescription();
    chrome.runtime.sendMessage(createMessage(SEND_INTERVAL_INFO, lastIntervalDescription), Function.prototype);
    hideOverlay();
  });

  chrome.runtime.onMessage.addListener(
    (request = {}, sender, sendResponse) => {
      if(request !== null && isMessage(SHOW_OVERLAY, request)) {
        showOverlay().then(Function.prototype);
      }
      sendResponse({});
      return true;
    });
})();
