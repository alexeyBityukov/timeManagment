let interval = undefined;
const intervalTimerDurationSec = 5*60;

const setIntervalTimerTextContent = (text) => {
	chrome.storage.local.set({ intervalTimerTextContent: text });
};
const getIntervalTimerStr = (timestamp) => {
	const hour = (Math.floor(timestamp / 3600)).toString().padStart(2, '0');	
	const minute = (Math.floor((timestamp - hour * 3600)/ 60)).toString().padStart(2, '0');	
	const seconds = (timestamp - hour * 3600 - minute * 60).toString().padStart(2, '0');
	return `${hour}:${minute}:${seconds}`;
};
const stopInterval = () => {
	clearInterval(interval);
	interval = undefined;
	setIntervalTimerTextContent('');
};

const startInterval = () => {
	const timeout = 1 * 25;
	let maxSoundInteval = Date.now() + intervalTimerDurationSec * 1000;

	const play = () => {
	  var audio = new Audio('./resources/interval.mp3');
	  audio.play();
	};
	const intervalCallback = () => {
		setIntervalTimerTextContent(getIntervalTimerStr(Math.round((maxSoundInteval - Date.now()) / 1000)));
		if(Date.now() > maxSoundInteval) {
			maxSoundInteval = Date.now() + intervalTimerDurationSec * 1000;
			play();
		}
	}
	if(interval === undefined) {
		play();
		interval = setInterval(intervalCallback, timeout);
	}
	else {
		clearInterval(interval);
		interval = undefined;
		startInterval()
	}
};	

chrome.storage.onChanged.addListener(({ intervalStatus: { newValue, oldValue } = {} }) => {
	if(newValue !== oldValue && (newValue === 'start' || newValue === 'stop')) {
		const updateStatus = () => chrome.storage.local.set({ intervalStatus: 'process' });
    	switch(newValue) {
    		case 'start': updateStatus(); startInterval(); break;
    		case 'stop': updateStatus(); stopInterval(); break;
    	}
  	}
})