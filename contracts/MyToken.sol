pragma solidity >=0.5.0 <0.6.0;

import "./Interfaces/VerificationListInterface.sol";

library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}

/**
 * @title ERC20Basic
 * @dev Simpler version of ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
contract ERC20Basic {
    uint256 public _totalSupply;

    function totalSupply() public view returns (uint256);

    function balanceOf(address who) public view returns (uint256);

    function transfer(address to, uint256 value) public;

    event Transfer(address indexed from, address indexed to, uint256 value);
}

/**
 * @title ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
contract ERC20 is ERC20Basic {
    function allowance(address owner, address spender)
        public
        view
        returns (uint256);

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public;

    function approve(address spender, uint256 value) public;

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

/**
 * @title Basic token
 * @dev Basic version of StandardToken, with no allowances.
 */
contract BasicToken is ERC20Basic {
    using SafeMath for uint256;

    mapping(address => uint256) public balances;
    address contractOwner; //the address to which the fees will go to

    // additional variables for use if transaction fees ever became necessary
    uint256 public basisPointsRate = 20;
    uint256 public maximumFee = 20;

    /**
     * @dev Fix for the ERC20 short address attack.
     */
    modifier onlyPayloadSize(uint256 size) {
        require(!(msg.data.length < size + 4));
        _;
    }

    /**
     * @dev transfer token for a specified address
     * @param _to The address to transfer to.
     * @param _value The amount to be transferred.
     */
    function transfer(address _to, uint256 _value)
        public
        onlyPayloadSize(2 * 32)
    {
        require(_to != address(0), "ERC20: transfer to the zero address");

        uint256 fee = (_value.mul(basisPointsRate)).div(1000);
        /*if (fee > maximumFee) {
            fee = maximumFee;
        }*/
        uint256 sendAmount = _value.sub(fee);
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(sendAmount);
        if (fee > 0) {
            balances[contractOwner] = balances[contractOwner].add(fee);
            emit Transfer(msg.sender, contractOwner, fee);
        }
        emit Transfer(msg.sender, _to, sendAmount);
    }

    /**
     * @dev Gets the balance of the specified address.
     * @param _owner The address to query the the balance of.
     * @return An uint representing the amount owned by the passed address.
     */
    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }
}

/**
 * @title Standard ERC20 token
 *
 * @dev Implementation of the basic standard token.
 * @dev https://github.com/ethereum/EIPs/issues/20
 * @dev Based oncode by FirstBlood: https://github.com/Firstbloodio/token/blob/master/smart_contract/FirstBloodToken.sol
 */
contract StandardToken is BasicToken, ERC20 {
    mapping(address => mapping(address => uint256)) public allowed;

    uint256 public constant MAX_UINT = 2**256 - 1;

    /**
     * @dev Transfer tokens from one address to another
     * @param _from address The address which you want to send tokens from
     * @param _to address The address which you want to transfer to
     * @param _value uint the amount of tokens to be transferred
     */
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public onlyPayloadSize(3 * 32) {
        require(_from != address(0), "ERC20: transfer from the zero address");
        require(_to != address(0), "ERC20: transfer to the zero address");

        uint256 _allowance = allowed[_from][msg.sender];

        // Check is not needed because sub(_allowance, _value) will already throw if this condition is not met
        // if (_value > _allowance) throw;

        uint256 fee = (_value.mul(basisPointsRate)).div(1000);
        /*if (fee > maximumFee) {
            fee = maximumFee;
        }*/
        if (_allowance < MAX_UINT) {
            allowed[_from][msg.sender] = _allowance.sub(_value);
        }
        uint256 sendAmount = _value.sub(fee);
        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(sendAmount);
        if (fee > 0) {
            balances[contractOwner] = balances[contractOwner].add(fee);
            emit Transfer(_from, contractOwner, fee);
        }
        emit Transfer(_from, _to, sendAmount);
    }

    /**
     * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
     * @param _spender The address which will spend the funds.
     * @param _value The amount of tokens to be spent.
     */
    function approve(address _spender, uint256 _value)
        public
        onlyPayloadSize(2 * 32)
    {
        // To change the approve amount you first have to reduce the addresses`
        //  allowance to zero by calling `approve(_spender, 0)` if it is not
        //  already 0 to mitigate the race condition described here:
        //  https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
        require(
            !((_value != 0) && (allowed[msg.sender][_spender] != 0)),
            "ERC20:race condition created"
        );

        require(_spender != address(0), "ERC20: approve to the zero address");

        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
    }

    /**
     * @dev Function to check the amount of tokens than an owner allowed to a spender.
     * @param _owner address The address which owns the funds.
     * @param _spender address The address which will spend the funds.
     * @return A uint specifying the amount of tokens still available for the spender.
     */
    function allowance(address _owner, address _spender)
        public
        view
        returns (uint256 remaining)
    {
        return allowed[_owner][_spender];
    }
}

contract OwnerList {
    address public owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    /**
     * Constructor sets original 'owner' of the contract to the sender address
     */
    constructor(address _owner) public {
        owner = _owner;
        emit OwnershipTransferred(address(0), owner);
    }

    // Throws if called by any account other than the owner
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // Allows current owner to transfer contract control to a new owner
    function transferOwnership(address newOwner) public onlyOwner {
        if (newOwner != address(0)) {
            emit OwnershipTransferred(owner, newOwner);
            owner = newOwner;
        }
    }
}

/**
 * @title Pausable
 * @dev Base contract which allows children to implement an emergency stop mechanism.
 */
contract Pausable is OwnerList {
    event Pause();
    event Unpause();

    bool public paused = false;

    constructor(address _owner) public OwnerList(_owner) {}

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     */
    modifier whenNotPaused() {
        require(!paused);
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     */
    modifier whenPaused() {
        require(paused);
        _;
    }

    /**
     * @dev called by the owner to pause, triggers stopped state
     */
    function pause() public onlyOwner whenNotPaused {
        paused = true;
        emit Pause();
    }

    /**
     * @dev called by the owner to unpause, returns to normal state
     */
    function unpause() public onlyOwner whenPaused {
        paused = false;
        emit Unpause();
    }
}

contract OwnerVerList is Pausable {
    /////// Getters to allow the same blacklist/whitelist to be used also by other contracts  ///////

    constructor(address _owner) public Pausable(_owner) {
        _owneraddWhiteList(_owner);
    }

    function getownerBlackListStatus(address _maker)
        external
        view
        returns (bool)
    {
        return ownerBlackList[_maker];
    }

    function getownerWhiteListStatus(address _maker)
        external
        view
        returns (bool)
    {
        return ownerWhiteList[_maker];
    }

    function getOwnerofList() external view returns (address) {
        return owner;
    }

    mapping(address => bool) public ownerBlackList;
    mapping(address => bool) public ownerWhiteList;

    function owneraddBlackList(address _evilUser) public onlyOwner {
        require(_evilUser != address(0));
        require(_evilUser != owner);
        ownerBlackList[_evilUser] = true;
        if (ownerWhiteList[_evilUser]) {
            ownerWhiteList[_evilUser] = false;
            emit ownerRemovedWhiteList(_evilUser);
        }
        emit ownerAddedBlackList(_evilUser);
    }

    function ownerremoveBlackList(address _clearedUser) public onlyOwner {
        ownerBlackList[_clearedUser] = false;
        emit ownerRemovedBlackList(_clearedUser);
    }

    function _owneraddWhiteList(address _verifiedUser) internal {
        require(!ownerBlackList[_verifiedUser]);
        ownerWhiteList[_verifiedUser] = true;
        emit ownerAddedWhiteList(_verifiedUser);
    }

    function owneraddWhiteList(address _verifiedUser) public onlyOwner {
        _owneraddWhiteList(_verifiedUser);
    }

    function ownerremoveWhiteList(address _exUser) public onlyOwner {
        ownerWhiteList[_exUser] = false;
        emit ownerRemovedWhiteList(_exUser);
    }

    event ownerAddedBlackList(address _user);

    event ownerRemovedBlackList(address _user);

    event ownerAddedWhiteList(address _user);

    event ownerRemovedWhiteList(address _user);
}

contract MyToken is StandardToken, OwnerVerList {
    string public name;
    string public symbol;
    uint256 public decimals;
    IVerificationList mytokenList;

    //  The contract can be initialized with a number of tokens
    //  All the tokens are deposited to the owner address
    //
    // @param _balance Initial supply of the contract
    // @param _name Token Name
    // @param _symbol Token symbol
    // @param _decimals Token decimals
    string public tokenURI;
    bool mytokenVerificationList;
    bool ownerVerificationList;

    // Constructor
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _decimals,
        address _owner,
        uint256 _supply,
        string memory _tokenURI,
        bool _mytokenVerificationList,
        address _mytokenListAddress,
        bool _ownerVerificationList,
        address _contractOwner
    ) public OwnerVerList(_owner) {
        //_totalSupply = _supply.mul(10**_decimals);
        contractOwner = _contractOwner; //The address to which the fees will go to
        _totalSupply = _supply;
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        balances[_owner] = _totalSupply;
        tokenURI = _tokenURI;
        mytokenVerificationList = _mytokenVerificationList;
        mytokenList = IVerificationList(_mytokenListAddress);
        ownerVerificationList = _ownerVerificationList;

        emit Transfer(address(0), _owner, _totalSupply);
    }

    function transfer(address _to, uint256 _value) public whenNotPaused {
        if (
            mytokenVerificationList == true && ownerVerificationList == true
        ) {
            // TOKENIZER Check
            require(
                !mytokenList.isBlackListed(msg.sender) &&
                    !mytokenList.isBlackListed(_to)
            );
            require(
                mytokenList.isWhiteListed(msg.sender) &&
                    mytokenList.isWhiteListed(_to)
            );

            // OWNER Check
            require(!ownerBlackList[msg.sender] && !ownerBlackList[_to]);
            require(ownerWhiteList[msg.sender] && ownerWhiteList[_to]);

            return super.transfer(_to, _value);
        } else if (mytokenVerificationList == true) {
            // TOKENIZER Check
            require(
                !mytokenList.isBlackListed(msg.sender) &&
                    !mytokenList.isBlackListed(_to)
            );
            require(
                mytokenList.isWhiteListed(msg.sender) &&
                    mytokenList.isWhiteListed(_to)
            );

            return super.transfer(_to, _value);
        } else if (ownerVerificationList == true) {
            // OWNER Check
            require(!ownerBlackList[msg.sender] && !ownerBlackList[_to]);
            require(ownerWhiteList[msg.sender] && ownerWhiteList[_to]);

            return super.transfer(_to, _value);
        } else {
            return super.transfer(_to, _value);
        }
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public whenNotPaused {
        if (
            mytokenVerificationList == true && ownerVerificationList == true
        ) {
            // TOKENIZER CHECK
            require(
                !mytokenList.isBlackListed(msg.sender) &&
                    !mytokenList.isBlackListed(_to)
            );
            require(
                mytokenList.isWhiteListed(msg.sender) &&
                    mytokenList.isWhiteListed(_to)
            );

            // OWNER Check
            require(!ownerBlackList[msg.sender] && !ownerBlackList[_to]);
            require(ownerWhiteList[msg.sender] && ownerWhiteList[_to]);

            return super.transferFrom(_from, _to, _value);
        } else if (mytokenVerificationList == true) {
            // TOKENIZER CHECK
            require(
                !mytokenList.isBlackListed(msg.sender) &&
                    !mytokenList.isBlackListed(_to)
            );
            require(
                mytokenList.isWhiteListed(msg.sender) &&
                    mytokenList.isWhiteListed(_to)
            );

            return super.transferFrom(_from, _to, _value);
        } else if (ownerVerificationList == true) {
            // OWNER Check
            require(!ownerBlackList[msg.sender] && !ownerBlackList[_to]);
            require(ownerWhiteList[msg.sender] && ownerWhiteList[_to]);

            return super.transferFrom(_from, _to, _value);
        } else {
            return super.transferFrom(_from, _to, _value);
        }
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address who) public view returns (uint256) {
        return super.balanceOf(who);
    }

    function approve(address _spender, uint256 _value)
        public
        onlyPayloadSize(2 * 32)
    {
        return super.approve(_spender, _value);
    }

    function allowance(address _owner, address _spender)
        public
        view
        returns (uint256 remaining)
    {
        return super.allowance(_owner, _spender);
    }

    // Issue a new amount of tokens
    // these tokens are deposited into the owner address
    //
    // @param _amount Number of tokens to be issued
    function issue(uint256 amount) public onlyOwner {
        require(_totalSupply + amount > _totalSupply);
        require(balances[owner] + amount > balances[owner]);

        balances[owner] += amount;
        _totalSupply += amount;
        emit Issue(amount);
    }

    function setParams(uint256 newBasisPoints) public {
        require(msg.sender == contractOwner);

        basisPointsRate = newBasisPoints;

        emit Params(basisPointsRate);
    }

    // Called when new token are issued
    event Issue(uint256 amount);

    // Called if contract ever adds fees
    event Params(uint256 feeBasisPoints);
}
