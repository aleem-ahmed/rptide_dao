pragma solidity ^0.5.0;


// [IMPORT] Personal //
import "./DappToken.sol";
import "./DaiToken.sol";


contract TokenFarm {
	// [INIT] //
	string public name = "Dapp Token Farm";
	address public owner;
	DappToken public dappToken;
	DaiToken public daiToken;


	// [MAPPING] //
	address[] public stakers;
	mapping(address => uint) public stakingBalance;
	mapping(address => bool) public hasStaked;
	mapping(address => bool) public isStaking;


	// [CONSTRUCTOR] Runs once. Runs when the smart contract gets deployed to the network //
	constructor (DappToken _dappToken, DaiToken _daiToken) public {
		// [INIT][OWNER] //
		owner = msg.sender;

		// [INIT][SMART-CONTRACTS] Set local variables //
		dappToken = _dappToken;
		daiToken = _daiToken;
	}


	// [DEPOSIT] Stake Tokens //
	function stakeTokens(uint _amount) public {
		// [VALIDATE] _amount > 0 //
		require(_amount > 0, "amount cannot be 0");

		// [TRANSFER] Mock Dai tokens to THIS contract for staking //
		daiToken.transferFrom(msg.sender, address(this), _amount);

		// [UPDATE] Staking Balance //
		stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

		// [ADD] User to "stakers" *only* if they havent staked already //
		if (!hasStaked[msg.sender]) {
			stakers.push(msg.sender);
		}

		// Update staking balance
		isStaking[msg.sender] = true;
		hasStaked[msg.sender] = true;
	}


	// [UNSTAKE-WITHDRAW] Upstake Tokens //
	function unstakeTokens() public {
		// Fetch staking balance
		uint balance = stakingBalance[msg.sender];

		// Amount > 0 //
		require(balance > 0, "staking balance cannot be 0");

		// Transfer Mock Dai tokens to this contract for staking
		daiToken.transfer(msg.sender, balance);

		// Reset staking balance
		stakingBalance[msg.sender] = 0;

		// Update staking status
		isStaking[msg.sender] = false;
	}


	// [ISSUE] //
	function issueTokens() public {
		// [VALIDATE] Authorized Caller (owner only) //
		require(msg.sender == owner, "caller must be owner");

		for (uint i = 0; i<stakers.length; i++) {
			address recipient = stakers[i];
			uint balance = stakingBalance[recipient];

			if (balance > 0) {
				dappToken.transfer(recipient, balance);
			}
		}
	}
}