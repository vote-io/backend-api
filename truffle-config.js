module.exports = {
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 8000,
      network_id: "1337"
    },
    development: {
      host: "127.0.0.1",
      port: 8000,
      network_id: "*"
    }
  },
  compilers: {
    solc: {
      version: "0.8.0",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}