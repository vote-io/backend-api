const Contract = artifacts.require("Voting");

module.exports = function (deployer) {
    const args = ["candidate1", "candidate2"];
    deployer.deploy(Contract, args);
}