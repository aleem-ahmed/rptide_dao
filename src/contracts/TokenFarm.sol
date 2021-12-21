pragma solidity ^0.5.0;


// [IMPORT] Personal //
import "./DappToken.sol";
import "./DaiToken.sol";


contract TokenFarm {
	// [INIT] //
	string public name = "Dapp Token Farm";
	DappToken public dappToken;
	DaiToken public daiToken;


	// [MAPPING] //
	mapping(address => uint) public stakingBalance;


	// [CONSTRUCTOR] Runs once. Runs when the smart contract gets deployed to the network
	constructor (DappToken _dappToken, DaiToken _daiToken) public {
		// Set local variables to recieved variables
		dappToken = _dappToken;
		daiToken = _daiToken;
	}


	// [1][PUBLIC] Stake Tokens //
	function stakeTokens(uint _amount) public {

		// Transger Mock Dai tokens to this contract for staking
		daiToken.transferFrom(msg.sender, address(this), _amount);
	}

	// [2] Upstake Tokens //


	// [3] Issuing Tokens //
}