// [IMPORT] //
import React, { Component } from 'react'

// [IMPORT] Personal //
import './App.css'
import Navbar from './Navbar'
import Web3 from 'web3'

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			account: '0x0'
		}
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

		console.log(accounts);

		this.setState({ account: accounts[0] })
	}


	render() {
		return (
			<div>
				<Navbar account={this.state.account} />
				<div className="container-fluid mt-5">
					<div className="row">
						<main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
							<div className="content mr-auto ml-auto">
								<a
									href="http://www.dappuniversity.com/bootcamp"
									target="_blank"
									rel="noopener noreferrer"
								>
								</a>

								<h1>Hello, World!</h1>

							</div>
						</main>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
