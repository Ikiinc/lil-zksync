(async () => {
  const ethers = require('ethers')
  const zksync = require('zksync')
  const utils = require('./utils')
  const SLEEP_INTERVAL = process.env.SLEEP_INTERVAL || 50000

  const zkSyncProvider = await utils.getZkSyncProvider(zksync, process.env.NETWORK_NAME)
  const ethersProvider = await utils.getEthereumProvider(ethers, process.env.NETWORK_NAME)

  const bobGoerliWallet = new ethers.Wallet(process.env.BOB_PRIVATE_KEY, ethersProvider)
  console.log(`Bob's Goerli address is: ${bobGoerliWallet.address}`)
  console.log(`Bob's initial balance on Goerli is: ${ethers.utils.formatEther(await bobGoerliWallet.getBalance())}`)
  const bobZkSyncWallet = await utils.initAccount(bobGoerliWallet, zkSyncProvider, zksync)

  process.on('SIGINT', () => {
    console.log('Disconnecting')
    // Disconnect
    process.exit()
  })
  setInterval(async () => {
    await utils.displayZkSyncBalance(bobZkSyncWallet, ethers)
    console.log('---')
  }, SLEEP_INTERVAL)

})()

