const PromoCode = require('../models/promoCode');
const Tokenizer = require('../models/tokenizer');

const TokenizerPrice = +(process.env.TOKENIZER_PRICE || 49.99);
const MinTokenizerPrice = +(process.env.MIN_TOKENIZER_PRICE || 1);
const TestPromoCode = process.env.TEST_PROMO_CODE || '00000000';
const Top10 = [
  'ETH',
  'BTC',
  'USDT',
  'USDC',
  'DAI',
  'XRP',
  'BCH',
  'LTC',
  'EOS',
  'XMR',
];

const port = process.env.PORT;
let host = process.env.HOST;
// Check if host if defined, otherwise use ngrok for local environment
if (!host) {
  const ngrok = require('ngrok');
  ngrok.connect(port).then(url => {
    host = url;
    console.log(host);
  });
}

const coinsCache = {
  on: 0,
  coins: [],
};
const coinsCacheTTL = 24*3600*1000;

const isTestPromoCode = async (code) => {
  return code === TestPromoCode;
}

const getPromoCode = async (code) => {
  if (!code || code.length !== 8) {
    return false;
  }

  const promo = await PromoCode.findOne({ code: code.toUpperCase() });

  if (!promo) {
    return false;
  }

  if (promo.limitedBy) {
    if (promo.limitedBy === 'stock' && promo.stock === 0) {
      return false;
    } else if (promo.limitedBy === 'date') {
      const now = new Date();
      if (now > promo.expiration) {
        return false;
      }
    }
  }
  
  return promo;
};

const getCoins = client => async (req, res) => {
  try {
    if (Date.now() > (coinsCache.on + coinsCacheTTL) ) {
      const rates = await client.rates({short: 1, accepted: 1});

      coinsCache.on = Date.now();
      coinsCache.coins = [
        ...Top10,
        ...Object.keys(rates).filter(coin => Top10.indexOf(coin) === -1 && coin !== 'LTCT'),
      ];
    }
    
    res.send(coinsCache.coins);
  } catch(error) {
    console.error(error);
    res.status(500).send(error);
  }
};

const getPrice = (req, res) => {
  res.send({
    price: TokenizerPrice,
    minPrice: MinTokenizerPrice,
  });
};

const checkPromoCode = async (req, res) => {
  const code = req.params.code;
  const promo = await getPromoCode(code);
  res.send(promo ? {
    valid: true,
    value: promo.discount,
    useLTCT: isTestPromoCode(code),
  } : { 
    valid: false,
  });
};

const createTransaction = (client, sendMail) => async (req, res) => {
  const data = req.body;

  if (!isTestPromoCode(data.checkoutDetails.promoCode) && data.checkoutDetails.coin === 'LTCT') {
    console.log('Paying with LTCT is not allowed');
    res.status(404).send('Paying with LTCT is not allowed');
    return;
  }

  const promo = await getPromoCode(data.checkoutDetails.promoCode);
  const price = Math.max(+TokenizerPrice - (promo ? promo.discount : 0), +MinTokenizerPrice);

  const txOptions = {
    currency1: 'USD',
    currency2: data.checkoutDetails.coin,
    amount: price,
    buyer_email: data.email,
    buyer_name: data.firstName,
    ipn_url: `${host}/ipn`,
  };

  try {
    // Create Coinpayments transaction
    const transaction = await client.createTransaction( txOptions );
    console.log('Tx');
    const tokenizer = new Tokenizer({
      ...data,
      checkoutDetails: {
        ...data.checkoutDetails,
        ...transaction,
      },
    });
    console.log('tokenizer');

    try {
      await sendMail.sendPaymentEmail(data.email, {
        title: data.title,
        coin: data.checkoutDetails.coin,
        amount: transaction.amount,
        supply: data.supply,
        qr: transaction.qrcode_url,
        address: transaction.address,
        token: data.symbol,
        firstName: data.firstName,
        lastName: data.lastName,
        ownerCompany: data.ownerCompany,
        email: data.email,
        companyPhone: data.companyPhone,
        website: data.website,
        title: data.title,
        assetInfo: data.assetInfo,
        assetType: data.assetType !== 'Other' ? data.assetType : data.otherAsset,
        assetId: data.assetId,
        divisible: data.divisible,
        hodlersLimit: data.hodlersLimit === 'Yes' ? data.limitNumber : 'No' ,
        ownerETHAddress: data.ownerETHAddress,
        tokenDisplay: data.tokenDisplay,
      });
      tokenizer.emailSent.payment = true;
    } catch (error) {
      console.log('Error sending email', error);
    }
    console.log('Mail');
    await tokenizer.save();
    console.log('save');
    // Send QR link to front end
    res.send(transaction);
  } catch (error) {
    console.log('Error', error);
    res.status(500).send(error);
  }
};

module.exports = {
  getCoins,
  getPrice,
  getPromoCode,
  checkPromoCode,
  createTransaction,
  TokenizerPrice,
  MinTokenizerPrice,
  isTestPromoCode,
};
