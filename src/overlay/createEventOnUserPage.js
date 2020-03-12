const sendEvent = (eventStr) => () => {
  const event = document.createEvent('Event');
  event.initEvent(eventStr);
  document.dispatchEvent(event);  
};

const sendIntervalDescription = sendEvent('sendIntervalInfo');
const sendIntervalFromPrev = sendEvent('sendIntervalFromPrev');
const sendIntervalYoutube = sendEvent('sendIntervalYoutube');
const sendIntervalTwitch = sendEvent('sendIntervalTwitch');
const sendIntervalHabr = sendEvent('sendIntervalHabr');
const sendIntervalBudget = sendEvent('sendIntervalBudget');
const sendIntervalPriory1 = sendEvent('sendIntervalPriory1');
const sendIntervalPriory2 = sendEvent('sendIntervalPriory2');
const sendIntervalPriory3 = sendEvent('sendIntervalPriory3');
const sendIntervalPriory4 = sendEvent('sendIntervalPriory4');
const sendIntervalPriory5 = sendEvent('sendIntervalPriory5');

document.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      sendIntervalDescription()
    }
});

document.getElementById("intervalInfoButton_QWxleEJpdDI2").addEventListener("click", sendIntervalDescription);
document.getElementsByClassName('wrapPrevIntervalDescription_YWxleEJpdDAy')[0].addEventListener("click", sendIntervalFromPrev);
document.getElementsByClassName('youtubeInterval_QWxleEJpdDI1')[0].addEventListener("click", sendIntervalYoutube);
document.getElementsByClassName('twitchInterval_QWxleEJpdDI1')[0].addEventListener("click", sendIntervalTwitch);
document.getElementsByClassName('habrInterval_QWxleEJpdDI1')[0].addEventListener("click", sendIntervalHabr);
document.getElementsByClassName('budgetInterval_QWxleEJpdDI1')[0].addEventListener("click", sendIntervalBudget);
document.getElementsByClassName('priority1Interval_QWxleEJpdDIw')[0].addEventListener("click", sendIntervalPriory1);
document.getElementsByClassName('priority2Interval_QWxleEJpdDIw')[0].addEventListener("click", sendIntervalPriory2);
document.getElementsByClassName('priority3Interval_QWxleEJpdDIw')[0].addEventListener("click", sendIntervalPriory3);
document.getElementsByClassName('priority4Interval_QWxleEJpdDIw')[0].addEventListener("click", sendIntervalPriory4);
document.getElementsByClassName('priority5Interval_QWxleEJpdDIw')[0].addEventListener("click", sendIntervalPriory5);
