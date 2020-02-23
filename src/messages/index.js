const SHOW_OVERLAY = 'SHOW_OVERLAY';

const createMessage = messageStr => ({ message: messageStr });
const isMessage = (messageStr, { message } = {}) => message ===  messageStr;

export {
    SHOW_OVERLAY,
    createMessage,
    isMessage
};
