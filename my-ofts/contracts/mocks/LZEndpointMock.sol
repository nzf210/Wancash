// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

// We don't inherit from ILayerZeroEndpointV2 to avoid implementing all 50+ functions.
// We just implement what is called by OApp/OFT during simple tests.

contract LZEndpointMock {
    address public delegate;

    function setDelegate(address _delegate) external {
        delegate = _delegate;
    }

    // Needed for OFT constructor/checks sometimes?
    // OAppCore constructor calls: endpoint.setDelegate(_delegate)

    // OFT might call these:

    struct MessagingFee {
        uint256 nativeFee;
        uint256 lzTokenFee;
    }

    struct MessagingReceipt {
        bytes32 guid;
        uint64 nonce;
        MessagingFee fee; // This might be the 3rd argument needed: (guid, nonce, fee)
    }

    struct MessagingParams {
        uint32 dstEid;
        bytes32 receiver;
        bytes message;
        bytes options;
        bool payInLzToken;
    }

    function quote(
        MessagingParams calldata /*_params*/,
        address /*_sender*/
    ) external pure returns (MessagingFee memory) {
        return MessagingFee(0, 0);
    }

    // function send(MessagingParams calldata _params, address _refundAddress) external payable returns (MessagingReceipt memory) {
    //      return MessagingReceipt(bytes32(0), 0, MessagingFee(0, 0));
    // }
    // Note: If send is overloaded or struct is different, this might fail if we get signatures wrong.
    // For now, we only need deployment to succeed. Deployment only calls setDelegate.

    // Add dummy eid getter just in case
    function eid() external pure returns (uint32) {
        return 1;
    }
}
