pragma solidity >=0.5.0 <0.6.0;

interface IVerificationList {
    function isBlackListed(address _evilUser) external returns (bool);

    function isWhiteListed(address _clearedUser) external returns (bool);

    function addWhiteList(address _verifiedUser) external;
}
