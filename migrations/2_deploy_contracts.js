// This is the script that deploys the smart contracts to the ethereum blockchain
const TokenFarm = artifacts.require('TokenFarm')
const TokenFarmm = artifacts.require('TokenFarmm')

module.exports = function(deployer) {
	console.log('deployed')

	deployer.deploy(TokenFarm)

	deployer.deploy(TokenFarmm)
}
