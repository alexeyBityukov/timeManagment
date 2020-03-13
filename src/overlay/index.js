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
    'priority1Interval_QWxleEJpdDIw',
    'priority2Interval_QWxleEJpdDIw',
    'priority3Interval_QWxleEJpdDIw',
    'priority4Interval_QWxleEJpdDIw',
    'priority5Interval_QWxleEJpdDIw'
  ];

  if(document.getElementById('intervalInfo_QWxleEJpdDE1') === null) {
    const overlay = document.createElement('div');
    overlay.innerHTML = `
      <div class="root_YWxleEJpdDAx">
        <div class="setNewInterval_QWxleEJpdDEx">
          <input type="text" id="intervalInfo_QWxleEJpdDE1" class="buttonTimeManagment_QWxleEJpdDE2" />
          <button id="intervalInfoButton_QWxleEJpdDI2" class="buttonTimeManagment_QWxleEJpdDE2">Send</button>
        </div>
        <div class="wrapPrevIntervalDescription_YWxleEJpdDAy">
          <a class="prevIntervalDescription_QWxleEJpdDEw">${await getLastIntervalDescription()}</a>
        </div>
        <div class="quickDescInterval_QWxleEJpdDEx">
          <button class="youtubeInterval_QWxleEJpdDI1 buttonTimeManagment_QWxleEJpdDE2">YouTube</button>
          <button class="twitchInterval_QWxleEJpdDI1 buttonTimeManagment_QWxleEJpdDE2">Twitch</button>
          <button class="habrInterval_QWxleEJpdDI1 buttonTimeManagment_QWxleEJpdDE2">Habr</button>
          <button class="budgetInterval_QWxleEJpdDI1 buttonTimeManagment_QWxleEJpdDE2">Бюджет</button>
        </div>
        <ul class="wrapPrevIntervalsDescription_QWxleEJpdDI3">
          <li class="priority1Interval_QWxleEJpdDIw"></li>
          <li class="priority2Interval_QWxleEJpdDIw"></li>
          <li class="priority3Interval_QWxleEJpdDIw"></li>
          <li class="priority4Interval_QWxleEJpdDIw"></li>
          <li class="priority5Interval_QWxleEJpdDIw"></li>
        </ul>
        <label class="mdc-text-field">
          <div class="mdc-text-field__ripple"></div>
          <input class="mdc-text-field__input" type="text" aria-labelledby="my-label-id">
          <span class="mdc-floating-label" id="my-label-id">Hint text</span>
          <div class="mdc-line-ripple"></div>
        </label>
      </div>`;
    overlay.className = 'timeManagmenOverlay_YWxleEJpdDAw'
    document.body.append(overlay);

    const { initStyles } = await import(chrome.runtime.getURL("./src/styles/index.js"));
    initStyles.call(this);
    
    mdc.textField.MDCTextField.attachTo(document.querySelector('.mdc-text-field'));
  }

  const showOverlay = async () => {
    document.getElementsByClassName('timeManagmenOverlay_YWxleEJpdDAw')[0].style.display = 'flex';
    document.getElementById('intervalInfo_QWxleEJpdDE1').focus();
    document.getElementsByClassName('prevIntervalDescription_QWxleEJpdDEw')[0].textContent = await getLastIntervalDescription();
    const priorityIntervals = await getPriorityIntervals();

    listClassNames.forEach((listElem) => {
      const intervalElem = document.getElementsByClassName(listElem)[0];
      intervalElem.style.display = 'none';
    });

    priorityIntervals.forEach(({description}, key) => {
      const intervalElem = document.getElementsByClassName(listClassNames[key])[0];
      intervalElem.textContent = description;
      intervalElem.style.display = 'list-item';
    });
  };
  
  const hideOverlay = () => document.getElementsByClassName('timeManagmenOverlay_YWxleEJpdDAw')[0].style.display = 'none';

  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('./src/overlay/createEventOnUserPage.js');
  script.onload = function () { this.remove()};

  (document.head || document.documentElement).appendChild(script);

  const addEventListenerSendInterval = (value, eventStr) => {
    document.addEventListener(eventStr, async () => {
      let nexValue = value;
      const intervalInfo = document.getElementById('intervalInfo_QWxleEJpdDE1');

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

  addEventListenerSendInterval(() => document.getElementById('intervalInfo_QWxleEJpdDE1').value, 'sendIntervalInfo'); 
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
