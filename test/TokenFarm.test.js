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
				// Load Contracts //
				daiToken = await DaiToken.new()
				dappToken = await DappToken.new()
				tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

				// [FUNCTION][TRANSFER] Transfer all (1 million) dapp tokens to TokenFarm //
				await dappToken.transfer(tokenFarm.address, tokens('1000000'))


				// [FUNCTION][TRANSFER] Transfer 100 Mock DAI tokens to investor //
				await daiToken.transfer(
					investor,
					tokens('100'),
					{
						from: owner
					}
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
				// [IT] //
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
	}
)