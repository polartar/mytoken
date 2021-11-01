/**
 * @file Ownable.sol
 *
 * contract for basic authorization control functions
 */

pragma solidity ^0.5.0;

contract InitializableOwnable {
    address public owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    /**
     * initializer sets original 'owner' of the contract to the _owner address
     */
    function initializeOwnable(address _owner) internal {
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
