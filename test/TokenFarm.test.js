const { assert } = require('chai')

// [ARTIFACTS][REQUIRE] Personal //
const DaiToken = artifacts.require('DaiToken')
const DappToken = artifacts.require('DappToken')
const TokenFarm = artifacts.require('TokenFarm')


require('chai')
	.use(require('chai-as-promised'))
	.should()


function tokens(n) { return web3.utils.toWei(n, 'ether') }


contract(
	'TokenFarm',
	([ owner, investor ]) => {
		// [INIT] //
		let daiToken
		let dappToken
		let tokenFarm


		// [BEFORE] //
		before(
			async () => {
				// [LOAD-CONTRACT] //
				daiToken = await DaiToken.new()
				dappToken = await DappToken.new()
				tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

				// [FUNCTION][TRANSFER] Transfer all (1 million) dapp tokens to TokenFarm //
				await dappToken.transfer(tokenFarm.address, tokens('1000000'))


				// [FUNCTION][TRANSFER] Transfer 100 Mock DAI tokens to investor //
				await daiToken.transfer(
					investor,
					tokens('100'),
					{ from: owner }
				)
			}
		)


		// [DESCRIBE] //
		describe(
			'Mock DAI deployment',
			async () => {
				// [IT] //
				it(
					'has a name',
					async () => {
						const name = await daiToken.name()

						assert.equal(name, 'Mock DAI Token')
					}
				)
			}
		)


		// [DESCRIBE] //
		describe(
			'Dapp Token deployment',
			async () => {
				// [IT] //
				it(
					'has a name',
					async () => {
						const name = await dappToken.name()

						assert.equal(name, 'DApp Token')
					}
				)
			}
		)


		// [DESCRIBE] //
		describe(
			'Token Farm deployment',
			async () => {
				// [IT] Check name of //
				it(
					'has a name',
					async () => {
						const name = await tokenFarm.name()

						assert.equal(name, 'Dapp Token Farm')
					}
				)

				// [IT] //
				it(
					'contract has tokens',
					async () => {
						let balance = await dappToken.balanceOf(tokenFarm.address)
						
						assert.equal(balance.toString(), tokens('1000000'))
					}
				)
			}
		)


		describe(
			'Farming tokens',
			async () => {
				it(
					'rewards investors for staking mDAI tokens',
					async () => {
						let result

						// [READ][SMART-CONTRACT][daiToken] Investor balance //
						result = await daiToken.balanceOf(investor)
						
						// Check investor balance before staking //
						assert.equal(
							result.toString(),
							tokens('100'),
							'investor mDAI wallet balance correct before staking'
						)

						// [FUNCTION][SMART-CONTACT] Stake Mock DAI Tokens
						await daiToken.approve(
							tokenFarm.address,
							tokens('100'),
							{ from: investor }
						)
						
						await tokenFarm.stakeTokens(
							tokens('100'),
							{ from: investor }
						)

						// [READ][SMART-CONTRACT][daiToken] Investor balance //
						result = await daiTokens.balanceOf(investor)

						// Check investor balance after staking //
						assert.equal(
							result.toString(),
							tokens('0'),
							'investor mDAI wallet balance correct after staking'
						)

						assert.equal(
							result.toString(),
							tokens('100'),
							'investor mDAI wallet balance correct after staking'
						)
					}
				)
			}
		)
	}
)