const fs = require('fs');

const FROM = 'contact@defiventures.cc';

const basicTemplate = {
  from: FROM,
};

const paymentTemplate = {
  ...basicTemplate,
  templateId: 'd-432d2dae9dd2447599bfe25a5ea64750',
};

const paymentConfirmationTemplate = {
  ...basicTemplate,
  templateId: 'd-4882301ef3fb4a039c164bb203a255f4',
};

const confirmationTemplate = {
  ...basicTemplate,
  templateId: 'd-bf92594d13ce4eb489bcb39d59da8f99',
};

function sendMail(sgMail) {
  const sendPaymentEmail = (email, paymentData) => {
    const msg = {
      ...paymentTemplate,
      to: email,
      dynamic_template_data: paymentData,
    };

    return sgMail.send(msg);
  }

  const sendPaymentConfirmation = (email, paymentConfirmationData) => {
    const msg = {
      ...paymentConfirmationTemplate,
      to: email,
      dynamic_template_data: paymentConfirmationData,
    };

    return sgMail.send(msg);
  }

  const sendConfirmationEmail = (email, confirmationData) => {
    const msg = {
      ...confirmationTemplate,
      to: email,
      dynamic_template_data: confirmationData,
    };

    return sgMail.send(msg);
  }

  return {
    sendPaymentEmail,
    sendPaymentConfirmation,
    sendConfirmationEmail,
  }
}

module.exports = sendMail;