import axios from "../setup/axios";

const createNewSessionChat = () => {
  return axios.post("/chatbot/session/create");
};
const sendMessageService = (message, session_id) => {
  console.log("đã gửi");

  return axios.post("/chatbot/message", { message, session_id });
};
const getHistoryService = (session_id) => {
  console.log("send", session_id);

  return axios.get(`/chatbot/history?session_id=${session_id}`);
};
const clearChatService = (session_id) => {
  return axios.delete(`/chatbot/clear/${session_id}`);
};

export {
  createNewSessionChat,
  clearChatService,
  sendMessageService,
  getHistoryService,
};
