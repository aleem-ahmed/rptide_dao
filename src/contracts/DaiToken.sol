pragma solidity ^0.5.0;

contract DaiToken {
    // [INIT] //
    string public name = "Mock DAI Token";
    string public symbol = "mDAI";
    uint256 public totalSupply = 1000000000000000000000000; // 1 million tokens
    uint8 public decimals = 18;


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

    // [MAPPING] allowance //
    mapping(address => mapping(address => uint256)) public allowance;


    // [CONSTRUCTOR] //
    constructor () public {
        // Set totalSupply
        balanceOf[msg.sender] = totalSupply;
    }


    // [PUBLIC] Transfer funds from mes.sender to specifed value //
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        // [EMIT] Transfer //
        emit Transfer(msg.sender, _to, _value);

        return true;
    }


    // [PUBLIC] //
    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;

        // [EMIT] Approval //
        emit Approval(msg.sender, _spender, _value);

        return true;
    }
    

    // [PUBLIC] //
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;

        // [EMIT] Transfer //
        emit Transfer(_from, _to, _value);

        return true;
    }
}
