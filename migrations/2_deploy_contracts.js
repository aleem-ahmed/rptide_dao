// [ARTIFACTS][REQUIRE] Personal //
// This is the script that deploys the smart contracts to the ethereum blockchain
const DaiToken = artifacts.require('DaiToken')
const DappToken = artifacts.require('DappToken')
const TokenFarm = artifacts.require('TokenFarm')


module.exports = async function (deployer, network, accounts) {
	// [DEPLOY] Mock DAI Token //
	await deployer.deploy(DaiToken)

	const daiToken = await DaiToken.deployed()


	// [DEPLOY] Dapp Token //
	await deployer.deploy(DappToken)

	const dappToken = await DappToken.deployed()


	// [DEPLOY] TokenFarm //
	await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)
	
	const tokenFarm = await TokenFarm.deployed()


	// [FUNCTION][TRANSFER] Transfer all (1 million) TokenFarm tokens to TokenFarm //
	await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')


	// [FUNCTION][TRANSFER] Transfer 100 Mock DAI tokens to investor //
	await daiToken.transfer(accounts[1], '100000000000000000000')
}