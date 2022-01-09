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
				tokenFarm = await TokenFarm.new(
					dappToken.address,
					daiToken.address
				)

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

						// [READ][daiToken] PRESTAKE balance Investor's //
						result = await daiToken.balanceOf(investor)
						
						// [VERIFY] balance == 100 //
						assert.equal(
							result.toString(),
							tokens('100'),
							'Investor mDAI wallet balance correct before staking'
						)

						// [APPROVE] Mock DAI Tokens //
						await daiToken.approve(
							tokenFarm.address,
							tokens('100'),
							{ from: investor }
						)

						// [STAKE-DEPOSIT] //
						await tokenFarm.stakeTokens(
							tokens('100'),
							{ from: investor }
						)

						// [READ][daiToken] POSTSTAKE balance investor's //
						result = await daiToken.balanceOf(investor)

						// [VERIFY] daiBalance is 0 //
						assert.equal(
							result.toString(),
							tokens('0'),
							'Investor mDAI wallet balance correct after staking'
						)

						// [READ][daiToken] balance tokenFarm's //
						result = await daiToken.balanceOf(tokenFarm.address)

						// [VERIFY] tokenFarm has updated total staking balance //
						assert.equal(
							result.toString(),
							tokens('100'),
							'TokenFarm mDAI wallet balance correct after staking'
						)

						// [READ][tokenFarm] Investor's balance //
						result = await tokenFarm.stakingBalance(investor)

						// [VERIFY] //
						assert.equal(
							result.toString(),
							tokens('100'),
							'TokenFarm mDAI wallet balance correct after staking'
						)

						// [READ][tokenFarm] Investor's balance //
						result = await tokenFarm.isStaking(investor)

						// [VERIFY] Investor's staking status == true //
						assert.equal(
							result.toString(),
							'true',
							'Investor staking status correct after staking'
						)

						// [ISSUE] //
						await tokenFarm.issueTokens({ from: owner })

						// [READ][dappToken] Investor's balance after issuance //
						result = await dappToken.balanceOf(investor)

						// [VERIFY] Investor's dappToken balance == 100 //
						assert.equal(
							result.toString(),
							tokens('100'),
							'Investor DApp token wallet balance correct after issuance'
						)

						// [AUTH] Ensure that only owner can issue tokens //
						await tokenFarm.issueTokens({ from: investor }).should.be.rejected

						// [UNSTAKE-WITHDRAW] tokens //
						await tokenFarm.unstakeTokens({ from: investor })

						// [READ][daiToken] Investor's balance //
						result = await daiToken.balanceOf(investor)

						// [VERIFY] //
						assert.equal(
							result.toString(),
							tokens('100'),
							'Investor mDai wallet balance correct after unstaking'
						)

						// [READ][daiToken][balanceOf] tokenFarm Address //
						result = await daiToken.balanceOf(tokenFarm.address)

						// [VERIFY] //
						assert.equal(
							result.toString(),
							tokens('0'),
							'TokenFarm mDai balance correct after unstaking'
						)

						// [READ][tokenFarm][stakingBalance] investor //
						result = await tokenFarm.stakingBalance(investor)
						
						// [VERIFY] Investor's staking balance == 0//
						assert.equal(
							result.toString(),
							tokens('0'),
							'investor mDai staking balance correct after unstaking'
						)

						// [READ][tokenFarm][stakingBalance] investor //
						result = await tokenFarm.isStaking(investor)
						
						// [VERIFY] Investor's staking status == false //
						assert.equal(
							result.toString(),
							'false',
							'investor mDai staking status correct after unstaking'
						)
					}
				)
			}
		)
	}
)