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

  const getPriorityIntervals = async () => {
    const intervals = await new Promise((resolve) => {
      chrome.storage.local.get('intervalLog', ({ intervalLog = [] }) => {
        resolve(intervalLog);
      });
    });

    const priorityIntervals = intervals.reduce((acc, {description}) => {
      const unicId = acc.findIndex(({description: unicDescription}) => unicDescription === description);
      if(unicId !== -1)
        acc[unicId].count++;
      else 
        acc.push({
          count: 1,
          description,
        }); 
        
      return acc; 
    }, []);

    priorityIntervals.sort(({count: firstCount}, {count: secondCount}) => secondCount - firstCount);

    return priorityIntervals.slice(0, 5);
  }
  const setLinkStyle = (elem) => {
    const setDefaultStyle = (elem) => {
      elem.style.color = '#1a0dab';
      elem.style.cursor = 'default';
      elem.style.textDecoration = 'none';
    };

    setDefaultStyle(elem);

    elem.onmouseover = ({ target }) => {
      target.style.color = '#1a0dab';
      target.style.cursor = 'pointer';
      target.style.textDecoration = 'underline';
    };
    
    elem.onmouseout = ({ target }) => {
      setDefaultStyle(target);
    };
  };

  const listClassNames = [
    'priority1Interval',
    'priority2Interval',
    'priority3Interval',
    'priority4Interval',
    'priority5Interval'
  ];

  if(document.getElementById('intervalInfo') === null) {
    const overlay = document.createElement('div');
    overlay.innerHTML = `
      <div class="root">
        <div class="setNewInterval">
          <input type="text" id="intervalInfo" class="buttonTimeManagment" />
          <button id="intervalInfoButton" class="buttonTimeManagment">Send</button>
        </div>
        <div class="wrapPrevIntervalDescription">
          <a class="prevIntervalDescription">${await getLastIntervalDescription()}</a>
        </div>
        <div class="quickDescInterval">
          <button class="youtubeInterval buttonTimeManagment">YouTube</button>
          <button class="twitchInterval buttonTimeManagment">Twitch</button>
          <button class="habrInterval buttonTimeManagment">Habr</button>
          <button class="budgetInterval buttonTimeManagment">Бюджет</button>
        </div>
        <ul class="wrapPrevIntervalsDescription">
          <li class="priority1Interval"></li>
          <li class="priority2Interval"></li>
          <li class="priority3Interval"></li>
          <li class="priority4Interval"></li>
          <li class="priority5Interval"></li>
        </ul>
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
    prevIntervalElemWrap.style.padding = '10px 0 10px 10px';
    prevIntervalElemWrap.style.textAlign = 'left';
    const prevIntervalElem = document.getElementsByClassName('prevIntervalDescription')[0];
    const quickDescIntervalElem = document.getElementsByClassName('quickDescInterval')[0];
    quickDescIntervalElem.style.display = 'flex';
    quickDescIntervalElem.style.justifyContent = 'space-between';
    const newIntervalElem = document.getElementsByClassName('setNewInterval')[0];
    newIntervalElem.style.display = 'flex';
    newIntervalElem.style.justifyContent = 'center';
    const rootElem = document.getElementsByClassName('root')[0];
    rootElem.style.width = '300px';
    const intervalInfoElem = document.getElementById('intervalInfo');
    intervalInfoElem.style.width = '100%';
    setLinkStyle(prevIntervalElem);
    const buttons = document.getElementsByClassName('buttonTimeManagment');
    for (let elem of buttons) {
      elem.style.fontSize = '14px';
      elem.style.fontWeight = '400';
      elem.style.padding = '1px 7px 2px';
      elem.style.borderWidth = '1px';
      elem.style.borderStyle = 'solid';
      elem.style.borderColor = 'gb(216, 216, 216) rgb(209, 209, 209) rgb(186, 186, 186)';
      elem.style.borderImage = 'initial';
      elem.style.borderRadius = '0';
      elem.style.color = 'rgba(0, 0, 0, 0.847)';
      elem.style.background = 'rgb(255, 255, 255)';
      elem.style.lineHeight = '21px';

      elem.onmouseover = ({ target }) => {
        target.style.cursor = 'pointer';
      };
      
      elem.onmouseout = ({ target }) => {
        elem.style.cursor = 'default';
      };
    }
    listClassNames.forEach((value) => {
      document.getElementsByClassName(value)[0].style.display = 'none';
    });
  }

  const showOverlay = async () => {
    document.getElementById('timeManagmenOverlay').style.display = 'flex';
    document.getElementById('intervalInfo').focus();
    document.getElementsByClassName('prevIntervalDescription')[0].textContent = await getLastIntervalDescription();
    const priorityIntervals = await getPriorityIntervals();
    const wrapPrevIntervalsDescriptionElem = document.getElementsByClassName('wrapPrevIntervalsDescription')[0];
    wrapPrevIntervalsDescriptionElem.style.padding = '10px 0 0 15px';
    wrapPrevIntervalsDescriptionElem.style.listStyle = 'disc outside';
    listClassNames.forEach((listElem) => {
      const intervalElem = document.getElementsByClassName(listElem)[0];
      intervalElem.style.display = 'none';
    });
    priorityIntervals.forEach(({description}, key) => {
      const intervalElem = document.getElementsByClassName(listClassNames[key])[0];
      intervalElem.textContent = description;
      setLinkStyle(intervalElem);
      intervalElem.style.paddingTop = '5px';
      intervalElem.style.display = 'list-item';
    });
  };
  
  const hideOverlay = () => document.getElementById('timeManagmenOverlay').style.display = 'none';

  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('./src/overlay/createEventOnUserPage.js');
  script.onload = function () { this.remove()};

  (document.head || document.documentElement).appendChild(script);

  const addEventListenerSendInterval = (value, eventStr) => {
    document.addEventListener(eventStr, async () => {
      let nexValue = value;
      const intervalInfo = document.getElementById('intervalInfo');

      if(typeof value === 'function') {
        nexValue = await value();
      }
      
      if(nexValue) {
        hideOverlay();
        chrome.runtime.sendMessage(createMessage(SEND_INTERVAL_INFO, nexValue), Function.prototype);
      }
      intervalInfo.value = '';
    });
  };

  addEventListenerSendInterval(() => document.getElementById('intervalInfo').value, 'sendIntervalInfo'); 
  addEventListenerSendInterval(async () => await getLastIntervalDescription(), 'sendIntervalFromPrev'); 
  addEventListenerSendInterval('Смотрю Youtube', 'sendIntervalYoutube'); 
  addEventListenerSendInterval('Смотрю Twitch', 'sendIntervalTwitch'); 
  addEventListenerSendInterval('Читаю Habr', 'sendIntervalHabr'); 
  addEventListenerSendInterval('Считаю бюджет', 'sendIntervalBudget'); 
  addEventListenerSendInterval(async () => (await getPriorityIntervals())[0].description, 'sendIntervalPriory1'); 
  addEventListenerSendInterval(async () => (await getPriorityIntervals())[1].description, 'sendIntervalPriory2'); 
  addEventListenerSendInterval(async () => (await getPriorityIntervals())[2].description, 'sendIntervalPriory3'); 
  addEventListenerSendInterval(async () => (await getPriorityIntervals())[3].description, 'sendIntervalPriory4'); 
  addEventListenerSendInterval(async () => (await getPriorityIntervals())[4].description, 'sendIntervalPriory5'); 

  chrome.runtime.onMessage.addListener(
    (request = {}, sender, sendResponse) => {
      if(request !== null && isMessage(SHOW_OVERLAY, request)) {
        showOverlay().then(Function.prototype);
      }
      sendResponse({});
      return true;
    });
})();
