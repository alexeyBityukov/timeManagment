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
