/**
 * @file Ownable.sol
 *
 * contract for basic authorization control functions
 */

pragma solidity ^0.5.0;

contract Ownable {
    address public owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    /**
     * Constructor sets original 'owner' of the contract to the sender address
     */
    constructor() public {
        owner = msg.sender;
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
