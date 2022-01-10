const Migrations = artifacts.require("Migrations")

module.exports = function(deployer) {
	// [DEPLOY] Migrations.sol //
	deployer.deploy(Migrations)
}
