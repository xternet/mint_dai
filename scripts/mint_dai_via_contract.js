const MintDai = artifacts.require("MintDai");
const { legos } = require("@studydefi/money-legos");
const { ethers, Wallet, Contract } = require("ethers");

//Instructions in README
const privateKey = '0x637950a9c80a16fb645c44c0c41b9359a5e34dd3e47bb66da5c052034e8883a8' //paste Private Key of 1st ganache-cli account
const provider = new ethers.providers.JsonRpcProvider(); //connect to ganache on port 8545
const wallet = new ethers.Wallet(privateKey, provider)

module.exports = async function(callback) {
	try{
    const contract = await MintDai.deployed()
    const DAI = new ethers.Contract(legos.erc20.dai.address, legos.erc20.dai.abi, wallet);
	
    console.log('Balance ETH b4:', ethers.utils.formatEther(await wallet.getBalance()))
		console.log('Balance DAI b4:', ethers.utils.formatEther(await DAI.balanceOf(wallet.address)))

    await contract.myCustomOpenVaultFunction(
      legos.maker.dssCdpManager.address,
      legos.maker.jug.address,
      legos.maker.ethAJoin.address,
      legos.maker.daiJoin.address,
      ethers.utils.parseUnits("5100", legos.erc20.dai.decimals), //5.1k DAI; Amount have to be high enough, cuz fees!
      { gasLimit: 4000000, value: ethers.utils.parseEther("3") },
    )

    console.log('Balance ETH after:', ethers.utils.formatEther(await wallet.getBalance()))
		console.log('Balance DAI after:', ethers.utils.formatEther(await DAI.balanceOf(wallet.address)))
	} catch (e) {
		console.log(e)
	} callback()
}