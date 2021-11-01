const path = require("path");

/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

// const HDWalletProvider = require('@truffle/hdwallet-provider');
// const infuraKey = "fj4jll3k.....";
//
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();
//var HDWalletProvider = require("@truffle/hdwallet-provider");
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "";
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
  //   port: 8545,
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    rinkebyGeth: {
      host: "127.0.0.1",
      port: 8545,
      from: "",
      network_id: 4,
      gas: 4612388,
      gasPrice: 20000000000,
      confirmations: 2,
    },
    mainnetInfura: {
     provider: function() {
      return new HDWalletProvider(mnemonic, "https://mainnet.infura.io/v3/2db28c77d27546b4b149b70bc524a9c5");
     },
     network_id: 1,
     gas: 5500000,
     gasPrice: 35000000000,
     timeoutBlocks: 200,
     websockets: true,
     from: ""
   },
    rinkebyInfura: {
     provider: function() {
      return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/2db28c77d27546b4b149b70bc524a9c5");
     },
     network_id: 4,
     gas: 5500000,
     gasPrice: 30000000000,
     timeoutBlocks: 50,
     websockets: true,
     from: ""
   },
     ropstenInfura: {
      provider: function() {
       return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/2db28c77d27546b4b149b70bc524a9c5");
      },
      network_id: 3,
      gas: 5500000,
      gasPrice: 40000000000,
      confirmations: 2,
      timeoutBlocks: 200,
      backoff_seconds: 3,
      websockets: true,
      from: ""
    },
  },

  // Configure your compilers
  compilers: {
    solc: {
       version: "0.5.16",    // Fetch exact version from solc-bin (default: truffle's version)
     //  docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
       settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        },
        evmVersion: "byzantium"
       }
    }
  }

};
