<template>
	<div id="app">
		<h6>{{ account }}</h6>
		<h6>{{ daiToken }}</h6>
		<h6>{{ dappToken }}</h6>
		<h6>{{ tokenFarm }}</h6>
		<h6>{{ daiTokenBalance }}</h6>
		<h6>{{ dappTokenBalance }}</h6>
		<h6>{{ stakingBalance }}</h6>
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

		components: {
			
		},

		methods: {
			async loadWeb3() {
				if (window.ethereum) {
					window.web3 = new Web3(window.ethereum)
					await window.ethereum.enable()
				}
				else if (window.web3) {
					window.web3 = new Web3(window.web3.currentProvider)
				}
				else {
					window.alert('non-ethereum browser detected. Install metamask')
				}
			},

			async loadBlockchainData() {
				const web3 = window.web3

				const accounts = await web3.eth.getAccounts()
				const networkId = await web3.eth.net.getId()

				this.setState({ account: accounts[0] })

				// [LOAD] DaiToken //
				const daiTokenData = DaiToken.networks[networkId]
				
				if (daiTokenData) {
					// [CONTRACT] //
					const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)

					// [BALANCE-OF] //
					const daiTokenBalance = await daiToken.methods.balanceOf(this.account).call()
					
					// [STATE] //
					this.setState({
						daiToken: daiToken,
						daiTokenBalance: daiTokenBalance.toString()
					})
				}
				else {
					window.alert('DaiToken contract not deployed to detected network')
				}

				// [LOAD] DappToken //
				const dappTokenData = DappToken.networks[networkId]
				
				if (dappTokenData) {
					// [CONTRACT] //
					const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address)

					// [BALANCE-OF] //
					const dappTokenBalance = await dappToken.methods.balanceOf(this.account).call()
					
					// [STATE] //
					this.setState({
						dappToken: dappToken,
						dappTokenBalance: dappTokenBalance.toString()
					})
				}
				else {
					window.alert('DappToken contract not deployed to detected network')
				}


				// [LOAD] TokenFarm //
				const tokenFarmData = TokenFarm.networks[networkId]
				
				if (tokenFarmData) {
					// [CONTRACT] //
					const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)

					// [STAKING-BALANCE] //
					const stakingBalance = await tokenFarm.methods.stakingBalance(this.account).call()
					
					// [STATE] //
					this.setState({
						tokenFarm: tokenFarm,
						stakingBalance: stakingBalance.toString()
					})
				}
				else {
					window.alert('DappToken contract not deployed to detected network')
				}

				// [STATE][LOADING] //
				this.setState({ loading: false })
			},

			async stakeTokens(amount) {
				try {
					this.setState({ loading: true })
				
					// [APPROVE] //
					await this.daiToken.methods
						.approve(this.tokenFarm._address, amount)
						.send({ from: this.account })
				
					// [STAKE] //
					await this.tokenFarm.methods
						.stakeTokens(amount)
						.send({ from: this.account })

					this.setState({ loading: false })	
				}
				catch (err) {
					this.error = err
				}
			},

			async unstakeTokens(amount) {
				try {
					console.log(amount)

					this.setState({ loading: true })
				
					// [STAKE] //
					await this.tokenFarm.methods
						.unstakeTokens()
						.send({ from: this.account })

					this.setState({ loading: false })	
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

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
