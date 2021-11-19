/**
 * @file MyToken.sol
 # @author sypeer
 *
 * contract to store and create erc20 tokens on payment
 */

pragma solidity >=0.5.0 <0.6.0;

import "../Tokenize.sol";
import "../Proxy/InitializableOwnable.sol";
import "../Proxy/Upgradeable.sol";

interface InitializeInterface {
    function initialize(address _owner) external;
}

contract MyTokenStorage {
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
        bool mytokenVerificationList; // Should the token use Tokenizer's verification list or the owners'
        bool ownerVerificationList; // Is the owner using their own verification list
        string tokenURI; //A URI that has the metadata of the token
    }
}

contract AddedStorage {
    //Whatever variable you want to add
    uint256 public newVariable;
}

contract UpdatedMyToken is
    Upgradeable,
    InitializableOwnable,
    MyTokenStorage,
    AddedStorage,
    InitializeInterface
{
    // initializes (works like a constructor)
    function initialize(address _owner) external {
        super.initialize();
        InitializableOwnable.initializeOwnable(_owner);
        contractOwner = address(0xfCfA3389103E766aaC000CBBD2eF9dE387A42e8d);
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

    function aNewFunction() public {
        //do something
        newVariable = 100;
    }

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
        bool _mytokenVerificationList,
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
            _mytokenVerificationList,
            _ownerVerificationList,
            _tokenURI
        );
        tokenDetails[token.tokenId] = token;
        //  contractOwner.transfer(msg.value);

        Tokenize tokenized = new Tokenize(
            token.name,
            token.symbol,
            token.decimal,
            token.owner,
            token.supply,
            token.tokenURI,
            token.mytokenVerificationList,
            verificationListAddress,
            token.ownerVerificationList,
            contractOwner
        );
        //If they want to use mytoken verification list then whitleist the owner
        if (token.mytokenVerificationList == true)
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

    function updateVerificationListAddress(address _verificationListAddress)
        public
        onlyOwner
    {
        verificationListAddress = _verificationListAddress;
    }

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
}
