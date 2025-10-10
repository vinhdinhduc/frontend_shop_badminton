import axios from "../setup/axios";

const sendEmail = (emailData) => {
  return axios.post("/email/contact", emailData);
};
const newsLetter = (emailData) => {
  return axios.post("/email/newsletter", emailData);
};
export { sendEmail, newsLetter };
