// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {IERC7857DataVerifier, TransferValidityProof} from "./IERC7857DataVerifier.sol";
import {IERC7857Metadata} from "./IERC7857Metadata.sol";

interface IERC7857 {
    /// @notice The verifier interface that this NFT uses
    /// @return The address of the verifier contract
    function verifier() external view returns (IERC7857DataVerifier);

    /// @notice Transfer data with ownership
    /// @param _to Address to transfer data to
    /// @param _tokenId The token to transfer data for
    /// @param _proofs Proofs of data available for _to
    function iTransfer(
        address _to,
        uint256 _tokenId,
        TransferValidityProof[] calldata _proofs
    ) external;

    /// @notice Clone data
    /// @param _to Address to clone data to
    /// @param _tokenId The token to clone data for
    /// @param _proofs Proofs of data available for _to
    /// @return _newTokenId The ID of the newly cloned token
    function iClone(
        address _to,
        uint256 _tokenId,
        TransferValidityProof[] calldata _proofs
    ) external returns (uint256 _newTokenId);


    /// @notice Add authorized user to group
    /// @param _tokenId The token to add to group
    function authorizeUsage(uint256 _tokenId, address _user) external;

    /// @notice Get token owner
    /// @param _tokenId The token identifier
    /// @return The current owner of the token
    function ownerOf(uint256 _tokenId) external view returns (address);

    /// @notice Get the authorized users of a token
    /// @param _tokenId The token identifier
    /// @return The current authorized users of the token
    function authorizedUsersOf(
        uint256 _tokenId
    ) external view returns (address[] memory);
}
