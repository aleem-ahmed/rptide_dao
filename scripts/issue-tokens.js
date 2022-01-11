// [ARTIFACTS][REQUIRE] Personal //
const TokenFarm = artifacts.require('TokenFarm')


module.exports = async function (callback) {
	let tokenFarm = await TokenFarm.deployed()
	
	// [ISSUE] //
	await tokenFarm.issueTokens()

	console.log('Tokens issued!')
	
	callback()
}