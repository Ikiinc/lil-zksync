(async () => {
  const ethers = require('ethers')
  const zksync = require('zksync')
  const utils = require('./utils')
  
  const token = 'ETH'
  const amountToDeposit = '0.05'
  const amountToTransfer = '0.02'
  const amountToWithdraw = '0.002'

  const zkSyncProvider = await utils.getZkSyncProvider(zksync, process.env.NETWORK_NAME)
  const ethersProvider = await utils.getEthereumProvider(ethers, process.env.NETWORK_NAME)
  
  //Alice Goerli wallet
  console.log('Creating a new Goerli wallet for Alice')
  const aliceGoerliWallet = new ethers.Wallet(process.env.ALICE_PRIVATE_KEY, ethersProvider)
  console.log(`Alice's Goerli address is: ${aliceGoerliWallet.address}`)
  //Alice Goerli balance
  const aliceInitialGoerliBalance = await aliceGoerliWallet.getBalance()
  console.log(`Alice's initial balance on Goerli is: ${ethers.utils.formatEther(aliceInitialGoerliBalance)}`)
  //Alice zksync wallet
  console.log('Creating a zkSync wallet for Alice')
  const aliceZkSyncWallet = await utils.initAccount(aliceGoerliWallet, zkSyncProvider, zksync)

  console.log('Depositing eth token to zksync account')
  await utils.depositToZkSync(aliceZkSyncWallet, token, amountToDeposit, ethers)
  await utils.displayZkSyncBalance(aliceZkSyncWallet, ethers)
  await utils.registerAccount(aliceZkSyncWallet)

  console.log('Transferring token between zksync accounts')
  const transferFee = await utils.getFee('Transfer', process.env.BOB_ADDRESS, token, zkSyncProvider, ethers)
  await utils.transfer(aliceZkSyncWallet, process.env.BOB_ADDRESS, amountToTransfer, transferFee, token, zksync, ethers)

  console.log('Withdrawing token from zksync acc to ethereum')
  // Start here
  const withdrawalFee = await utils.getFee('Withdraw', aliceGoerliWallet.address, token, zkSyncProvider, ethers)
  await utils.withdrawToEthereum(aliceZkSyncWallet, amountToWithdraw, withdrawalFee, token, zksync, ethers)

})()

