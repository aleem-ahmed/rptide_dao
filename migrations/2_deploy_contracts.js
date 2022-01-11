// [ARTIFACTS][REQUIRE] Personal //
// This is the script that deploys the smart contracts to the ethereum blockchain
const DaiToken = artifacts.require('DaiToken')
const DappToken = artifacts.require('DappToken')
const TokenFarm = artifacts.require('TokenFarm')


module.exports = async function (deployer, network, accounts) {
	// [DEPLOY] DaiToken.sol //
	await deployer.deploy(DaiToken)

	const daiToken = await DaiToken.deployed()


	// [DEPLOY] DappToken.sol //
	await deployer.deploy(DappToken)

	const dappToken = await DappToken.deployed()


	// [DEPLOY] TokenFarm.sol //
	await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)
	
	const tokenFarm = await TokenFarm.deployed()


	// [FUNCTION][TRANSFER] All (1 million) DAPP tokens to TokenFarm //
	await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')


	// [FUNCTION][TRANSFER] 100 mDAI tokens to investor //
	console.log('INVESTOR ACCOUNT:', accounts[1]);
	await daiToken.transfer(accounts[1], '100000000000000000000')
}