const Contract = artifacts.require("Voting");

module.exports = function (deployer) {
    deployer.deploy(Contract);
}