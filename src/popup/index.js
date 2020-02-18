const setIntervalTimerTextContent = (text) => {
	const intervalTimer = document.getElementsByClassName('intervalTimer')[0];
	if(intervalTimer !== undefined) { 
		intervalTimer.textContent = text;
	}
};

const stopInterval = () => {
	chrome.storage.local.set({ intervalStatus: 'stop' });
};

const startInterval = () => {
	chrome.storage.local.set({ intervalStatus: 'start' });
};	

document.getElementById('startInterval').onclick = startInterval;
document.getElementById('stopInterval').onclick = stopInterval;

window.onload = function() {
	chrome.storage.local.get('intervalTimerTextContent', ({ intervalTimerTextContent }) => {
		setIntervalTimerTextContent(intervalTimerTextContent);
  	});

  	chrome.storage.onChanged.addListener(({ intervalTimerTextContent: { newValue, oldValue } = {} }) => {
  		if(newValue !== oldValue) {
			setIntervalTimerTextContent(newValue);
		}
	})
}