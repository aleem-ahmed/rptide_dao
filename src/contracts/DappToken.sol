pragma solidity ^0.5.0;

contract DappToken {
	// [INIT] //
	string  public name = "DApp Token";
	string  public symbol = "DAPP";
	uint256 public totalSupply = 1000000000000000000000000; // 1 million tokens
	uint8   public decimals = 18;


	// [EVENT] //
	event Transfer(
		address indexed _from,
		address indexed _to,
		uint256 _value
	);


	// [EVENT] //
	event Approval(
		address indexed _owner,
		address indexed _spender,
		uint256 _value
	);


	// [MAPPING] Balances //
	mapping(address => uint256) public balanceOf;

	// [MAPPING] Allowance //
	mapping(address => mapping(address => uint256)) public allowance;


	// [CONSTRUCTOR] //
	constructor() public {
		// Set totalSupply
		balanceOf[msg.sender] = totalSupply;
	}


	// [FUNCTION][PUBLIC][TRANSFER] Transfer funds from mes.sender to specifed value //
	function transfer(address _to, uint256 _value) public returns (bool success) {
		require(balanceOf[msg.sender] >= _value);

		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;

		// [EMIT-EVENT] //
		emit Transfer(msg.sender, _to, _value);

		return true;
	}


	// [FUNCTION][PUBLIC][APPROVE] Approve external contract to spend //
	function approve(address _spender, uint256 _value) public returns (bool success) {
		allowance[msg.sender][_spender] = _value;

		// [EMIT-EVENT] Approval //
		emit Approval(msg.sender, _spender, _value);
		
		return true;
	}


	// [FUNCTION][PUBLIC][TRANSFER-FROM] //
	function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
		require(_value <= balanceOf[_from]);
		require(_value <= allowance[_from][msg.sender]);
		
		balanceOf[_from] -= _value;
		balanceOf[_to] += _value;
		allowance[_from][msg.sender] -= _value;

		// [EMIT-EVENT] Transfer //
		emit Transfer(_from, _to, _value);

		return true;
	}
}