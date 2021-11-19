/**
 * @file SelfMyToken.sol
 # @author sypeer
 *
 * contract to store and create erc20 tokens on payment
 */

pragma solidity >=0.5.0 <0.6.0;

import "./MyToken.sol";
import "./Proxy/InitializableOwnable.sol";
import "./Proxy/Upgradeable.sol";

interface InitializeInterface {
    function initialize(address _owner) external;
}

contract SelfMyTokenStorage {
    using SafeMath for uint256;

    // State variables
    address payable public contractOwner; // Admin address
    uint256 public tokenId; // ID for token being created - use: mapping token to address
    uint8 public decimal; // Decimals for tokens being created
    uint256 public creationFee; // Fee charged for token creation
    address public verificationListAddress; //the uinque verificationList

    // Mappings
    mapping(uint256 => address) tokenOwner; // Token owner address mapped to token id
    mapping(uint256 => address) tokenAddress; // Token contract address mapped to token id
    mapping(uint256 => Token) tokenDetails; // Token details mapped to token id
    mapping(address => Token) tokenContract; // Token details mapped to token contract address
    mapping(address => string) ownerInfo; // A URI that takes to where all the info is stores(It would be like https://ipfs.io/ipfs/[ipfsHash])
    mapping(address => mapping(uint256 => address)) ownerTokens; // number of created tokens owned and ERC20 contract address, referenced by owner address
    mapping(address => address[]) tokenCount; // Number of token contracts owned

    // Structs
    struct Token {
        string name; // Name of token
        string symbol; // Symbol of token
        uint256 decimal; // Decimals in token
        uint256 supply; // Total token supply
        address payable owner; // web3 wallet address of token submitter
        uint256 tokenId; // Token id number - increments on token creation
        string tokenDesc; // Description of token project
        string assetType; // Type of asset being tokenized
        string assetId; // Asset ID if any (Registration number for example)
        bool holderLimit; // Is there a limit to the number of addresses allowed to hold the token
        uint256 maxHolders; // Maximum number of holders allowed (optional)
        //      bool restrictedHolders; // Can anyone hold the tokens or is it restricted to verified investors
        bool tokenizerVerificationList; // Should the token use MyTokenr's verification list or the owners'
        bool ownerVerificationList; // Is the owner using their own verification list
        string tokenURI; //A URI that has the metadata of the token
    }
}

contract SelfMyToken is
    Upgradeable,
    InitializableOwnable,
    SelfMyTokenStorage,
    InitializeInterface
{
    // initializes (works like a constructor)
    function initialize(address _owner) external {
        super.initialize();
        InitializableOwnable.initializeOwnable(_owner);
        contractOwner = address(0x55D9049d8b83F7CDE627AE6d8cAE9676692fAfe9);
        decimal = 18;
        tokenId = 0;
        creationFee = (1 ether) / 4;
    }

    // Events
    event TokenCreated(
        uint256 tokenId,
        string _name,
        string _symbol,
        uint256 _supply,
        address _owner,
        string tokenURI
    );

    // Methods
    function tokenizeAsset(
        string memory _name,
        string memory _symbol,
        uint256 _supply,
        address payable _tokenOwner,
        string memory _tokenDesc,
        string memory _assetType,
        string memory _assetId,
        bool _holderLimit,
        uint256 _maxHolders,
        //    bool _restrictedHolders,
        bool _tokenizerVerificationList,
        bool _ownerVerificationList,
        string memory _tokenURI
    ) public payable returns (bool) {
        //require(msg.value == creationFee);
        Token memory token = Token(
            _name,
            _symbol,
            decimal,
            _supply,
            _tokenOwner,
            tokenId,
            _tokenDesc,
            _assetType,
            _assetId,
            _holderLimit,
            _maxHolders,
            //          _restrictedHolders,
            _tokenizerVerificationList,
            _ownerVerificationList,
            _tokenURI
        );
        tokenDetails[token.tokenId] = token;
        //  contractOwner.transfer(msg.value);

        MyToken tokenized = new MyToken(
            token.name,
            token.symbol,
            token.decimal,
            token.owner,
            token.supply,
            token.tokenURI,
            token.tokenizerVerificationList,
            verificationListAddress,
            token.ownerVerificationList,
            contractOwner
        );
        //If they want to use tokenizer verification list then whitleist the owner
        if (token.tokenizerVerificationList == true)
            IVerificationList(verificationListAddress).addWhiteList(
                token.owner
            );
        tokenAddress[token.tokenId] = address(tokenized);
        tokenOwner[token.tokenId] = address(token.owner);
        tokenCount[token.owner].push(address(tokenized));
        tokenContract[address(tokenized)] = token;
        ownerTokens[token.owner][token.tokenId] = tokenAddress[token.tokenId];
        tokenId += 1;
        emit TokenCreated(
            token.tokenId,
            token.name,
            token.symbol,
            token.supply,
            token.owner,
            token.tokenURI
        );
        //return(tokenAddress[token.tokenId]);
        return (true);
    }

    function enterDetails(address _which, string memory _ownerDetails)
        public
        onlyOwner
        returns (bool)
    {
        //We need to allow access to this method to contractOwner only
        ownerInfo[_which] = _ownerDetails;
        return (true);
    }

    // Update verification list contract address
    function updateVerificationListAddress(address _verificationListAddress)
        public
        onlyOwner
    {
        verificationListAddress = _verificationListAddress;
    }

    // Return addresses of created token contracts by token owner address
    function getTokenAddresses(address _owner)
        public
        view
        returns (
            address[] memory // Should this also be restricted to contractOwner?
        )
    {
        return (tokenCount[_owner]);
    }

    function getTokenAddress(address _owner, uint256 _id)
        public
        view
        returns (address)
    {
        return (ownerTokens[_owner][_id]);
    }

    // Return stored Token Struct details for created token address
    function getTokenDetails(address _tokenAddress)
        public
        view
        onlyOwner
        returns (
          string memory,
          string memory,
          uint256,
          address,
          bool,
          bool,
          string memory
        )
    {
        Token memory token = tokenContract[_tokenAddress];
        return (
          token.name,
          token.symbol,
          token.supply,
          token.owner,
          token.tokenizerVerificationList,
          token.ownerVerificationList,
          token.tokenURI
        );
    }

    // Update IPFS URI on stored Token Struct
    function updateIPFS(address _tokenAddress, string memory _updatedIpfsHash)
        public
        onlyOwner
        returns (
          string memory,
          string memory
        )
    {
        Token memory token = tokenContract[_tokenAddress];
        string memory existingURI = token.tokenURI;
        token.tokenURI = _updatedIpfsHash;
        tokenContract[_tokenAddress] = token;
        return (
          existingURI,
          token.tokenURI
        );
    }
}
