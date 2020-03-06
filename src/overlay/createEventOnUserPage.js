const sendIntervalDescription = () => {
    const event = document.createEvent('Event');
    event.initEvent('SendIntervalInfo');
    document.dispatchEvent(event);
}

document.getElementById("intervalInfoButton").addEventListener("click", sendIntervalDescription);
document.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      sendIntervalDescription()
    }
});

const sendIntervalFromPrev = () => {
  const event = document.createEvent('Event');
  event.initEvent('sendIntervalFromPrev');
  document.dispatchEvent(event);
}

document.getElementsByClassName('wrapPrevIntervalDescription')[0].addEventListener("click", sendIntervalFromPrev);
