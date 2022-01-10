// [IMPORT] //
import React, { Component } from 'react'
import Web3 from 'web3'

// [IMPORT] Personal //
import DaiToken from '../abis/DaiToken.json'
import DappToken from '../abis/DappToken.json'
import TokenFarm from '../abis/TokenFarm.json'
import './App.css'
import Main from './Main'
import Navbar from './Navbar'

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			account: '0x0',
			daiToken: {},
			dappToken: {},
			tokenFarm: {},
			daiTokenBalance: '0',
			dappTokenBalance: '0',
			stakingBalance: '0',
			loading: true,
		}
	}

	render() {
		// [LOADING] //
		let content
		if (this.state.loading) {
			content = <h6>Loading..</h6>
		}
		else {
			content = <Main
				daiTokenBalance={this.state.daiTokenBalance}
				dappTokenBalance={this.state.dappTokenBalance}
				stakingBalance={this.state.stakingBalance}
			/>
		}

		return (
			<div>
				<Navbar account={this.state.account} />

				<div className="container mt-5">
					<main role="main">
						<div className="content">
							{content}
						</div>
					</main>
				</div>
			</div>
		);
	}

	async componentWillMount() {
		await this.loadWeb3()
		await this.loadBlockchainData()
	}

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
	}

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
			const daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
			
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
			const dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call()
			
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
			const stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
			
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
	}

	stakeTokens = async (amount) => {
		// [STATE][LOADING] //
		this.setState({ loading: true })

		//
		this.state.daiToken.methods.approve(this.state.tokenFarm._address, amount)
			.send({ from: this.state.account })
			.on(
				'transactionHash',
				(hash) => {
					this.state.tokenFarm.methods.stakeTokens(amount)
						.send({ from: this.state.account })
						.on(
							'transactionHash',
							(hash) => {
								// [STATE][LOADING] //
								this.setState({ loading: false })
							}
						)
				}
			)
	}
}

export default App;
