<template>
	<div id="app">
		<div class="">
			{{ loading }}
			<h3>{{ account }}</h3>
			<h3>{{ daiTokenBalance }}</h3>
			<h3>{{ dappTokenBalance }}</h3>
			<h3>{{ stakingBalance }}</h3>

			<h3 class="text-danger">{{ error }}</h3>
		</div>
	</div>
</template>

<script>
	// [IMPORT] //
	import Web3 from 'web3'

	// [IMPORT] Personal //
	import DaiToken from './abis/DaiToken.json'
	import DappToken from './abis/DappToken.json'
	import TokenFarm from './abis/TokenFarm.json'

	export default {
		name: 'App',

		data() {
			return {
				account: '0x0',
				daiToken: {},
				dappToken: {},
				tokenFarm: {},
				daiTokenBalance: '0',
				dappTokenBalance: '0',
				stakingBalance: '0',
				loading: true,
				error: '',
			}
		},

		methods: {
			async loadWeb3() {
				try {
					if (window.ethereum) {
						window.web3 = new Web3(window.ethereum)
						await window.ethereum.enable()
					}
					else if (window.web3) {
						window.web3 = new Web3(window.web3.currentProvider)
					}
					else {
						this.error = 'non-ethereum browser detected. Install metamask'
					}
				}
				catch (err) {
					this.error = err	
				}
			},

			async loadBlockchainData() {
				try {
					const web3 = window.web3

					const accounts = await web3.eth.getAccounts()
					const networkId = await web3.eth.net.getId()

					// [STATE] //
					this.account = accounts[0]

					// [LOAD] DaiToken //
					const daiTokenData = DaiToken.networks[networkId]
					
					if (daiTokenData) {
						// [CONTRACT] //
						const daiToken = new web3.eth.Contract(
							DaiToken.abi,
							daiTokenData.address
						)

						// [BALANCE-OF] //
						const daiTokenBalance = await daiToken.methods
							.balanceOf(this.account)
							.call()
						
						// [STATE] //
						this.daiToken = daiToken
						this.daiTokenBalance = daiTokenBalance.toString()
					}
					else {
						this.error = 'DaiToken contract not deployed to detected network'
					}

					// [LOAD] DappToken //
					const dappTokenData = DappToken.networks[networkId]
					
					if (dappTokenData) {
						// [CONTRACT] //
						const dappToken = new web3.eth.Contract(
							DappToken.abi,
							dappTokenData.address
						)

						// [BALANCE-OF] //
						const dappTokenBalance = await dappToken.methods
							.balanceOf(this.account)
							.call()

						// [STATE] //
						this.dappToken = dappToken
						this.dappTokenBalance = dappTokenBalance.toString()
					}
					else {
						this.error = 'DappToken contract not deployed to detected network'
					}


					// [LOAD] TokenFarm //
					const tokenFarmData = TokenFarm.networks[networkId]
					
					if (tokenFarmData) {
						// [CONTRACT] //
						const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)

						// [STAKING-BALANCE] //
						const stakingBalance = await tokenFarm.methods.stakingBalance(this.account).call()
						
						// [STATE] //
						this.tokenFarm = tokenFarm
						this.stakingBalance = stakingBalance.toString()
					}
					else {
						this.error = 'DappToken contract not deployed to detected network'
					}

					// [STATE][LOADING] //
					this.loading = false
				}
				catch (err) {
					this.error = err
				}
			},

			async stakeTokens(amount) {
				try {
					this.loading = true
				
					// [APPROVE] //
					await this.daiToken.methods
						.approve(this.tokenFarm._address, amount)
						.send({ from: this.account })
				
					// [STAKE] //
					await this.tokenFarm.methods
						.stakeTokens(amount)
						.send({ from: this.account })

					this.loading = false
				}
				catch (err) {
					this.error = err
				}
			},

			async unstakeTokens(amount) {
				try {
					console.log('UNSTAKING EVERYTHING NOT THIS AMOUNT:', amount)

					this.loading = true
				
					// [STAKE] //
					await this.tokenFarm.methods
						.unstakeTokens()
						.send({ from: this.account })

					this.loading = false
				}
				catch (err) {
					this.error = err
				}
			},
		},

		async created() {
			await this.loadWeb3()
			await this.loadBlockchainData()
		},
	}
</script>
