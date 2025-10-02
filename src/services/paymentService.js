import axios from "../setup/axios";

const createPaymentUrl = (dataPayment) => {
  return axios.post("/payment/vnpay/create-payment-url", dataPayment);
};
export { createPaymentUrl };
