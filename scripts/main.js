const hre = require("hardhat")
const { Framework } = require("@superfluid-finance/sdk-core")
const { ethers } = require("hardhat")
require("dotenv").config()
const MoneyRouterABI =
    require("../artifacts/contracts/MoneyRouter.sol/MoneyRouter.json").abi


//to run this script:
//1) Make sure you've created your own .env file
//2) Make sure that you have your network and accounts specified in hardhat.config.js
//3) Make sure that you add the address of your own money router contract
//4) Make sure that you change the 'amount' field in the sendLumpSumToContract function to reflect the proper amount
//3) run: npx hardhat run scripts/sendLumpSumToContract.js --network goerli
async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');

    //NOTE - make sure you add the address of the previously deployed money router contract on your network
    const moneyRouterAddress = "0x6cE360db8Cb15d3D963608A0675CF67862311043"

    const receiver = "0x9aCEcAF7e11BCbb9c114724FF8F51930e24f164b"

    const provider = new hre.ethers.providers.JsonRpcProvider(
        process.env.GOERLI_URL
    )

    const sf = await Framework.create({
        chainId: (await provider.getNetwork()).chainId,
        provider
    })

    const signers = await hre.ethers.getSigners()

    const moneyRouter = new ethers.Contract(
        moneyRouterAddress,
        MoneyRouterABI,
        provider
    )

    const daix = await sf.loadSuperToken("fDAIx")

    //call money router send lump sum method from signers[0]

    // await moneyRouter
    //     .connect(signers[0])
    //     .sendLumpSumToContract(daix.address, ethers.utils.parseEther("500"))
    //     .then(function (tx) {
    //         console.log(`
    //     Congrats! You just successfully sent funds to the money router contract. 
    //     Tx Hash: ${tx.hash}
    // `)
    //     })


    //call money router create flow method from signers[0]
    //     await moneyRouter
    //     .connect(signers[0])
    //     .createFlowFromContract(daix.address, receiver, "285802469135802")
    //     .then(function (tx) {
    //         console.log(`
    //     Congrats! You just successfully created a flow from the money router contract. 
    //     Tx Hash: ${tx.hash}
    // `)
    //     })    

    //call money router create flow into contract method from signers[0]
    //this flow rate is ~1000 tokens/month
    // await moneyRouter
    //     .connect(signers[0])
    //     .createFlowIntoContract(daix.address, "285802469135802")
    //     .then(function (tx) {
    //         console.log(`
    //     Congrats! You just successfully created a flow into the money router contract. 
    //     Tx Hash: ${tx.hash}
    // `)
    //     })

    //call money router create flow into contract method from signers[0]
    //this flow rate is ~1000 tokens/month
    // await moneyRouter
    //     .connect(signers[0])
    //     .deleteFlowFromContract(daix.address, receiver)
    //     .then(function (tx) {
    //         console.log(`
    //     Congrats! You just successfully deleted a flow from the money router contract. 
    //     Tx Hash: ${tx.hash}
    // `)
    //     })

    //call money router create flow into contract method from signers[0]
    //this flow rate is ~2000 tokens/month
    // await moneyRouter
    //     .connect(signers[0])
    //     .deleteFlowIntoContract(daix.address)
    //     .then(function (tx) {
    //         console.log(`
    //     Congrats! You just successfully delete a flow that was being sent into the money router contract. 
    //     Tx Hash: ${tx.hash}
    // `)
    //     })

    console.log(signers[0]);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
    console.error(error)
    process.exitCode = 1
})