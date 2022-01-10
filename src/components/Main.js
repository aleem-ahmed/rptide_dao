// [IMPORT] //
import React, { Component } from 'react'

import dai from '../assets/images/dai.png'

class Main extends Component {
	render() {
		return (
			<div>
				<div className="mb-5 card card-body">
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

				<div className="card card-body">
					<form
						className="mb-3"
						onSubmit={
							(event) => {
								event.preventDefault()
								let amount
								amount = this.input.value.toString()
								amount = window.web3.utils.toWei(amount, 'Ether')
								this.props.stakeTokens(amount)
							}
						}
					>
						<div>
							<label className="float-left"><b>Stake Tokens</b></label>
							<span className="float-right text-muted">
								Balance:
								{window.web3.utils.fromWei(this.props.daiTokenBalance, 'Ether')}
							</span>
						</div>

						<div className="input-group mb-4">
							<input
							type="text"
							ref={(input) => { this.input = input }}
							className="form-control form-control-lg"
							placeholder="0"
							required />
							<div className="input-group-append">
							<div className="input-group-text">
								<img src={dai} height='32' alt=""/>
								&nbsp;&nbsp;&nbsp; mDAI
							</div>
							</div>
						</div>

						{/* SUBMIT */}
						<button
							type="submit"
							className="btn btn-primary btn-block btn-lg"
							>Stake</button>
					</form>

					{/* UNSTAKE */}
					<button
						type="submit"
						className="btn btn-link btn-block btn-sm"
						onClick={(event) => {
							event.preventDefault()
							this.props.unstakeTokens()
						}}
					>
						Unstake
					</button>
				</div>
			</div>
		)
	}
}

export default Main
