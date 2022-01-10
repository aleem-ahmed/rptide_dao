// [IMPORT] //
import React, { Component } from 'react'

class Main extends Component {
	render() {
		return (
			<div>
				<div className="card card-body">
					<div className="row">
						<div className="col-12 text-center">
							<h1 class="mb-4">Your Wallet</h1>
						</div>

						<div className="col-12 col-sm-4 text-center">
							<h3>mDAI</h3>
							<h6>{this.props.daiTokenBalance}</h6>
						</div>

						<div className="col-12 col-sm-4 text-center">
							<h3>DAPP</h3>
							<h6>{this.props.dappTokenBalance}</h6>
						</div>

						<div className="col-12 col-sm-4 text-center">
							<h3>Staking</h3>
							<h6>{this.props.stakingBalance}</h6>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Main
