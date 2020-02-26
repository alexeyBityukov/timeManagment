const setIntervalTimerTextContent = (text) => {
	chrome.storage.local.get('intervalLog', ({ intervalLog = {}}) => {
		const intervalTimer = document.getElementsByClassName('intervalTimer')[0];
		const intervalTimerLog = document.getElementsByClassName('intervalTimerLog')[0];
		if(intervalTimer !== undefined && intervalTimerLog !== undefined) { 
			intervalTimer.textContent = text;
			intervalTimerLog.innerHTML = '';
			Object.keys(intervalLog).forEach(key => {
				let liLast = document.createElement('li');
				liLast.innerHTML = `${key}: ${intervalLog[key]}`;
				intervalTimerLog.append(liLast); 
			});
		}
	});
};

const stopInterval = () => {
	chrome.storage.local.set({ intervalStatus: 'stop' });
};

const startInterval = () => {
	chrome.storage.local.set({ intervalStatus: 'start' });
};	

const clearLog = () => {
	chrome.storage.local.set({ intervalLog: {} });
	const intervalTimerLog = document.getElementsByClassName('intervalTimerLog')[0].innerHTML = '';
};

document.getElementById('startInterval').onclick = startInterval;
document.getElementById('stopInterval').onclick = stopInterval;
document.getElementById('clearLog').onclick = clearLog;

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