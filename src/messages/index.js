const SHOW_OVERLAY = 'SHOW_OVERLAY';
const SEND_INTERVAL_INFO = 'SEND_INTERVAL_INFO';

const createMessage = (messageStr, payload = {}) => ({ message: messageStr, payload });
const isMessage = (messageStr, { message } = {}) => message ===  messageStr;

export {
    SHOW_OVERLAY,
    SEND_INTERVAL_INFO,
    createMessage,
    isMessage
};
