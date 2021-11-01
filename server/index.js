// Import express modules
const express = require('express');
const sgMail = require('@sendgrid/mail');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const sendMail = require('./sendMail')(sgMail);
const { beginTokenCreation, startPolling } = require('./tokenizer');
const mongoose = require('mongoose');
const crypto = require('crypto');

const {
  getCoins,
  getPrice,
  checkPromoCode,
  createTransaction,
  getPromoCode,
  TokenizerPrice,
  MinTokenizerPrice,
} = require('./controllers/checkout');


// Get constants from Environment Variables
const port = process.env.PORT;
const mongoHost = process.env.MONGODB_HOST;
const CoinpaymentsCredentials = {
  key: process.env.COINPAYMENTS_KEY,
  secret: process.env.COINPAYMENTS_SECRET,
};
const CoinpaymentsIpn = {
  secret: process.env.COINPAYMENTS_IPN_SECRET,
  merchant: process.env.COINPAYMENTS_IPN_MERCHANT,
}

// Connect to MongoDB Server
mongoose.connect(mongoHost, {useNewUrlParser: true, useUnifiedTopology: true});
const Tokenizer = require('./models/tokenizer');

startPolling();

// Import coinpayments client
const Coinpayments = require('coinpayments');
const client = new Coinpayments( CoinpaymentsCredentials );

// seup sendgrid
sgMail.setApiKey(process.env.SG_SECRET);

app.use(morgan('combined'))

// CORS
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false,
  verify: (req, res, buf) => {
    req.rawBody = buf
  },
}));
// parse application/json
app.use(bodyParser.json({}));

app.get('/coins', getCoins(client));
app.get('/price', getPrice);
app.get('/promoCode/:code', checkPromoCode);
// Coinpayments submission on front end call
app.post('/createTransaction', createTransaction(client, sendMail));

app.post('/ipn', async (req, res) => {
  const response = req.body;
  const httpHmac = req.headers['hmac'];
  console.log(response);
  
  if (!response 
    || !httpHmac 
    || !response.txn_id  
    || CoinpaymentsIpn.merchant !== response.merchant
  ) {
    console.log('Invalid Payload');
    res.sendStatus(200);
    return;
  }

  const hmac = crypto.createHmac('sha512', CoinpaymentsIpn.secret);
  hmac.update(req.rawBody);

  if (hmac.digest('hex') !== httpHmac) {
    console.error('Invalid HMAC');
    res.sendStatus(200);
    return;
  }

  try {
    const tokenizer = await Tokenizer.findOne({'checkoutDetails.txn_id': response.txn_id}).exec();

    if (!tokenizer) {
      console.log('Invalid txn_id, not present on db: ', response.txn_id);
      res.sendStatus(200);
    }

    if ( !tokenizer.paymentDetails
      || tokenizer.paymentDetails.status === undefined
      || tokenizer.paymentDetails.status < Number(response.status))
    {
      tokenizer.paymentDetails = response;
      // TODO: Detect rejected or timeout and do something with it
      if (tokenizer.paymentDetails.status >= 100) {
        console.log('PROMO CODE');
        console.log('promoCode: ', tokenizer.checkoutDetails.promoCode);
        const promo = await getPromoCode(tokenizer.checkoutDetails.promoCode);
        console.log('promo: ', promo);
        const price = Math.max(+TokenizerPrice - (promo ? promo.discount : 0), +MinTokenizerPrice);
        console.log('expected price: ', price);
        if (tokenizer.paymentDetails.amount1 >= price) {
          beginTokenCreation(tokenizer);
        } else {
          console.log(`${tokenizer.paymentDetails.txn_id} not the expected amount ${tokenizer.paymentDetails.amount1}`)
        }
      } else if (tokenizer.paymentDetails.status >= 1 && !tokenizer.paymentDetails.confirmationSent) {
        try {
          await sendMail.sendPaymentConfirmation(tokenizer.email, {
            supply: tokenizer.supply,
            token: tokenizer.symbol,
            address: tokenizer.ownerETHAddress,
          });
          tokenizer.emailSent.paymentConfirmation = true;
        } catch(error) {
          console.log('Error sending email', error);
        }
        tokenizer.paymentDetails.confirmationSent = true;
      }
    }

    tokenizer.paymentHistory.push(response);
    await tokenizer.save();
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Listen for traffic
app.listen(port, () => console.log(`Payments server listening at http://localhost:${port}`));
