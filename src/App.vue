<template>
	<div id="app">
		<BContainer v-if="!loading" class="my-5">
			<BCard class="mb-5">
				<BRow>
					<BCol cols="12" class="text-center">
						<h1 class="mb-4">Your Wallet</h1>
					</BCol>

					<BCol sm="4" class="text-center">
						<h3>mDAI</h3>
						<h6>{{ this.daiTokenBalance }}</h6>
					</BCol>

					<BCol sm="4" class="text-center">
						<h3>DAPP</h3>
						<h6>{{ this.dappTokenBalance }}</h6>
					</BCol>

					<BCol sm="4" class="text-center">
						<h3>Staking</h3>
						<h6>{{ this.stakingBalance }}</h6>
					</BCol>
				</BRow>
			</BCard>

			<BCard>
				<div>
					<label class="float-left">
						<b>Stake Tokens</b>
					</label>
					<span class="float-right text-muted">
						Balance: {{ daiTokenBalance }}
					</span>
				</div>

				<BInputGroup class="mb-4">
					<input
						v-model="amount"
						type="text"
						class="form-control form-control-lg"
						placeholder="0"
						required
					/>

					<BInputGroupAppend>
						<div class="input-group-text">
							<img :src="mDAIImage" height='32' alt=""/>
							&nbsp;&nbsp;&nbsp; mDAI
						</div>
					</BInputGroupAppend>
				</BInputGroup>

				<h6 class="my-3 text-success">
					Amount to be Staked: {{ amount }}
				</h6>

				<!-- [SUBMIT] STAKE -->
				<BButton
					variant="primary"
					size="lg"
					class="w-100 mb-3"
					@click="stakeTokens()"
				>Stake</BButton>

				<!-- [SUBMIT] UNSTAKE -->
				<BButton
					variant="none"
					size="sm"
					class="w-100"
					@click="unstakeTokens()"
				>Unstake</BButton>
			</BCard>
		</BContainer>

		<BContainer v-if="loading">
			Loading..
		</BContainer>

		<BContainer v-if="error">
			<h3 class="text-danger">Error: {{ error }}</h3>
		</BContainer>
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
				mDAIImage: require('./assets/images/dai.png'),
				amount: '',
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
						this.daiTokenBalance = window.web3.utils.fromWei(
							daiTokenBalance,
							"Ether"
						).toString()
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
						this.dappTokenBalance = window.web3.utils.fromWei(
							dappTokenBalance,
							"Ether"
						).toString()
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
						this.stakingBalance = window.web3.utils.fromWei(
							stakingBalance,
							"Ether"
						).toString()
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

			async stakeTokens() {
				try {
					this.loading = true
				
					// [CONVERT] //
					const amount = window.web3.utils.toWei(
						this.amount,
						"Ether"
					)

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
					console.log('sdf',err);
					this.error = err
				}
			},

			async unstakeTokens() {
				try {
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
