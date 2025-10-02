import axios from "../setup/axios";

const sendEmail = (emailData) => {
  return axios.post("/email/send", emailData);
};
const newsLetter = (emailData) => {
  return axios.post("/email/newsletter", emailData);
};
export { sendEmail, newsLetter };
