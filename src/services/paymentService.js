import axios from "../setup/axios";

const createPaymentUrl = (dataPayment) => {
  return axios.get("/payment/vnpay/create-payment-url", dataPayment);
};
export { createPaymentUrl };
