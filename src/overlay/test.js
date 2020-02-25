const sendIntervalDescription = () =>     function() {
    var event = document.createEvent('Event');
    event.initEvent('hello');
    document.dispatchEvent(event);
}