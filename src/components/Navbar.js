import React, { Component } from 'react'
import farmer from '../assets/images/farmer.png'

class Navbar extends Component {
	render() {
		return (
			<nav className="navbar navbar-dark bg-dark p-0">
				<div className="container">
					<a
						className="navbar-brand col-sm-3 col-md-2 mr-0"
						href="/"
					>
						<img
							src={farmer}
							width="30"
							height="30"
							className="d-inline-block align-top"
							alt="LOGO HERE"
						/>
						&nbsp; DApp Token Farm
					</a>

					<ul className="navbar-nav px-3">
						<li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
							<small className="text-secondary">
								<small id="account">{this.props.account}</small>
							</small>
						</li>
					</ul>
				</div>
			</nav>
		)
	}
}

export default Navbar;
