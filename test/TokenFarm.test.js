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
							'Investor mDAI wallet balance correct before staking'
						)

						// [FUNCTION][SMART-CONTACT] Stake Mock DAI Tokens
						await daiToken.approve(
							tokenFarm.address,
							tokens('100'),
							{ from: investor }
						)

						// [FUNCTION][DEPOSIT][STAKE] //
						await tokenFarm.stakeTokens(
							tokens('100'),
							{ from: investor }
						)

						// [READ][SMART-CONTRACT][daiToken] investor balance after staking //
						result = await daiToken.balanceOf(investor)
						assert.equal(
							result.toString(),
							tokens('0'),
							'Investor mDAI wallet balance correct after staking'
						)

						// [READ][SMART-CONTRACT][daiToken] tokenFarm balance //
						result = await daiToken.balanceOf(tokenFarm.address)
						assert.equal(
							result.toString(),
							tokens('100'),
							'Token Farm mDAI wallet balance correct after staking'
						)

						// [READ][SMART-CONTRACT][tokenFarm] Investor balance //
						result = await tokenFarm.stakingBalance(investor)
						assert.equal(
							result.toString(),
							tokens('100'),
							'Token Farm mDAI wallet balance correct after staking'
						)

						// [READ][SMART-CONTRACT][tokenFarm] Investor balance //
						result = await tokenFarm.isStaking(investor)
						assert.equal(
							result.toString(),
							'true',
							'Investor staking status correct after staking'
						)

						// Issue Tokens //
						await tokenFarm.issueTokens({ from: owner })

						// Check balance after issuance //
						result = await dappToken.balanceOf(investor)
						assert.equal(
							result.toString(),
							tokens('100'),
							'Investor DApp token wallet balance correct after issuance'
						)

						// Ensure that only owner can issue tokens //
						await tokenFarm.issueTokens({ from: investor }).should.be.rejected

						// [FUNCTION][WITHDRAW][UNSTAKE] tokens //
						await tokenFarm.unstakeTokens({ from: investor })

						// [VERIFY][READ][daiToken][balanceOf] investor //
						result = await daiToken.balanceOf(investor)
						assert.equal(
							result.toString(),
							tokens('100'),
							'Investor mDai wallet balance correct after unstaking'
						)

						// [VERIFY][READ][daiToken][balanceOf] tokenFarm Address //
						result = await daiToken.balanceOf(tokenFarm.address)
						assert.equal(
							result.toString(),
							tokens('0'),
							'Token Farm mDai balance correct after unstaking'
						)

						// [VERIFY][READ][daiToken][stakingBalance] investor //
						result = await daiToken.balanceOf(investor)
						assert.equal(
							result.toString(),
							tokens('0'),
							'investor mDai staking balance correct after unstaking'
						)
					}
				)
			}
		)
	}
)