/**
 * @file VerificationList.sol
 * @author sypeer
 *
 * contract to store whitelist and blacklist details
 */

pragma solidity >=0.5.0 <0.6.0;

import "./Ownable.sol";

contract Authorizable is Ownable {
    mapping(address => bool) public authorized;

    modifier onlyAuthorized() {
        require(
            authorized[msg.sender] || owner == msg.sender,
            "ERR_ONLY_ATHORIZED_ALLOWED"
        );
        _;
    }

    function addAuthorized(address _toAdd) public onlyOwner {
        require(_toAdd != address(0));
        authorized[_toAdd] = true;
    }

    function removeAuthorized(address _toRemove) public onlyOwner {
        require(_toRemove != address(0));
        require(_toRemove != msg.sender);
        authorized[_toRemove] = false;
    }

    function checkAuthorization(address _toCheck)
        public
        view
        onlyOwner
        returns (bool)
    {
        return authorized[_toCheck];
    }
}

contract VerificationList is Authorizable {
    // Getters to allow the same blacklist/whitelist to be used by other contracts
    function getBlackListStatus(address _maker)
        public
        view
        onlyAuthorized
        returns (bool)
    {
        return isBlackListed[_maker];
    }

    function getWhiteListStatus(address _maker)
        public
        view
        onlyAuthorized
        returns (bool)
    {
        return isWhiteListed[_maker];
    }

    function getOwner() external view returns (address) {
        return owner;
    }

    mapping(address => bool) public isBlackListed;
    mapping(address => bool) public isWhiteListed;

    function addBlackList(address _evilUser) public onlyAuthorized {
        require(_evilUser != address(0));
        require(_evilUser != owner);
        isBlackListed[_evilUser] = true;
        if (isWhiteListed[_evilUser]) {
            isWhiteListed[_evilUser] = false;
            emit RemovedWhiteList(_evilUser);
        }
        emit AddedBlackList(_evilUser);
    }

    function removeBlackList(address _clearedUser) public onlyAuthorized {
        isBlackListed[_clearedUser] = false;
        emit RemovedBlackList(_clearedUser);
    }

    function addWhiteList(address _verifiedUser) public onlyAuthorized {
        require(!isBlackListed[_verifiedUser]);
        isWhiteListed[_verifiedUser] = true;
        emit AddedWhiteList(_verifiedUser);
    }

    function removeWhiteList(address _exUser) public onlyAuthorized {
        isWhiteListed[_exUser] = false;
        emit RemovedWhiteList(_exUser);
    }

    event DestroyedBlackFunds(address _blackListedUser, uint256 _balance);

    event AddedBlackList(address _user);

    event RemovedBlackList(address _user);

    event AddedWhiteList(address _user);

    event RemovedWhiteList(address _user);
}
