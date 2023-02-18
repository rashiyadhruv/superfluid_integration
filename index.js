const hre = require("hardhat");
const { Framework } = require("@superfluid-finance/sdk-core");
const { ethers } = require("hardhat");
require("dotenv").config();
const MoneyRouterABI = require("./artifacts/contracts/MoneyRouter.sol/MoneyRouter.json")
  .abi;

const {
  key,
  collectionId,
  openweatherapikey,
  weatherapikey,
} = require("./config.js");
const { Revise } = require("revise-sdk");
const revise = new Revise({ auth: key });
const axios = require("axios");
const nft_id = "73544e46-d67f-4268-ac13-daeecd97d5e1";
let nftt = null;

const initflowrate = 100000000000000;
const receiveraddress = "0x9aCEcAF7e11BCbb9c114724FF8F51930e24f164b";

async function streamstart(rate, recaddress) {
  const moneyRouterAddress = "0x6cE360db8Cb15d3D963608A0675CF67862311043";

  const receiver = recaddress;

  const provider = new hre.ethers.providers.JsonRpcProvider(
    process.env.GOERLI_URL
  );

  const sf = await Framework.create({
    chainId: (await provider.getNetwork()).chainId,
    provider,
  });
  const signers = await hre.ethers.getSigners();

  const moneyRouter = new ethers.Contract(
    moneyRouterAddress,
    MoneyRouterABI,
    provider
  );

  const daix = await sf.loadSuperToken("fDAIx");
  // console.log("daix", daix);

  await moneyRouter
    .connect(signers[0])
    .createFlowFromContract(daix.address, receiver, rate)
    .then(function(tx) {
      console.log(`
        Congrats! You just successfully created a flow from the money router contract. 
        Tx Hash: ${tx.hash}
    `);
    });

  await moneyRouter
    .connect(signers[0])
    .createFlowIntoContract(daix.address, rate)
    .then(function(tx) {
      console.log(`
       Congrats! You just successfully created a flow into the money router contract. 
       Tx Hash: ${tx.hash}
    `);
    });
}

async function streamupdate(rate, recaddress) {
  const moneyRouterAddress = "0x6cE360db8Cb15d3D963608A0675CF67862311043";

  const receiver = recaddress;

  const provider = new hre.ethers.providers.JsonRpcProvider(
    process.env.GOERLI_URL
  );

  const sf = await Framework.create({
    chainId: (await provider.getNetwork()).chainId,
    provider,
  });
  const signers = await hre.ethers.getSigners();

  const moneyRouter = new ethers.Contract(
    moneyRouterAddress,
    MoneyRouterABI,
    provider
  );

  const daix = await sf.loadSuperToken("fDAIx");
  // console.log("daix", daix);

  await moneyRouter
    .connect(signers[0])
    .updateFlowFromContract(daix.address, receiver, rate)
    .then(function(tx) {
      console.log(`
        Congrats! You just successfully updated a flow from the money router contract. 
        Tx Hash: ${tx.hash}
    `);
    });

  await moneyRouter
    .connect(signers[0])
    .updateFlowIntoContract(daix.address, rate)
    .then(function(tx) {
      console.log(`
      Congrats! You just successfully updated a flow into the money router contract. 
      Tx Hash: ${tx.hash}
    `);
    });
}

async function streamdelete(recaddress) {
  const moneyRouterAddress = "0x6cE360db8Cb15d3D963608A0675CF67862311043";

  const receiver = recaddress;

  const provider = new hre.ethers.providers.JsonRpcProvider(
    process.env.GOERLI_URL
  );

  const sf = await Framework.create({
    chainId: (await provider.getNetwork()).chainId,
    provider,
  });
  const signers = await hre.ethers.getSigners();

  const moneyRouter = new ethers.Contract(
    moneyRouterAddress,
    MoneyRouterABI,
    provider
  );

  const daix = await sf.loadSuperToken("fDAIx");
  // console.log("daix", daix);

  // call money router delete flow into contract method from signers[0]
  //   this flow rate is ~1000 tokens/month
  await moneyRouter
    .connect(signers[0])
    .deleteFlowFromContract(daix.address, receiver)
    .then(function(tx) {
      console.log(`
        Congrats! You just successfully deleted a flow from the money router contract. 
        Tx Hash: ${tx.hash}
    `);
    });

  // call money router delete flow into contract method from signers[0]
  // this flow rate is ~2000 tokens/month
  await moneyRouter
    .connect(signers[0])
    .deleteFlowIntoContract(daix.address)
    .then(function(tx) {
      console.log(`
        Congrats! You just successfully delete a flow that was being sent into the money router contract. 
        Tx Hash: ${tx.hash}
    `);
    });
}

const updateflowrate = (initdura, currdura, currflowrate, type) => {
  // console.log(initdura, currdura, currflowrate, type);

  switch (type) {
    case "constant":
      return currflowrate;
      break;
    case "logarithmic":
      let newflowrate1 = currflowrate * Math.log(initdura - currdura);
      return newflowrate1;
      break;
    case "linear":
      // console.log("inside linear");
      let newflowrate2 = currflowrate * (initdura - currdura);
      // console.log("new", newflowrate2);
      return newflowrate2;
      break;
    case "exponential":
      let newflowrate3 = currflowrate * Math.exp(initdura - currdura);
      return newflowrate3;
      break;
    default:
      return currflowrate;
      break;
  }
};

async function API() {
  let revisions = await revise.fetchRevisions(nft_id);
  let dura1 = revisions?.revisions[0]?.metaData[1]?.durablity;
  let dura2 = revisions?.revisions[1]?.metaData[1]?.durablity;
  let initdura = 100;

  if (dura1 < dura2 && dura2 < 100) {
    console.log("durablity is reduced : updating streame");
    let newflowrate = updateflowrate(initdura, dura1, initflowrate, "linear");
    console.log("new flow rate", newflowrate);
    streamupdate(newflowrate.toString(), receiveraddress);
  } else if (dura1 < dura2 && dura2 == 100) {
    console.log("durablity is reduced for the first time : starting streame");
    streamstart(initflowrate.toString(), receiveraddress);
  } else {
    console.log("durablity is constant : not updating streame");
    streamdelete(receiveraddress);
  }
  return null;
}

async function run() {
  const collection = await revise.addCollection({
    name: "Rental Asset",
    uri: "rentalasset",
  });
  console.log("Collection created", collection);
}

async function add() {
  const res = await revise.addNFT(
    {
      name: "rare sword 3",
      tokenId: "1",
      description: "A sword that is very rare and can be used to kill monsters",
      image: "https://i.ibb.co/ykZfv37/6000-2-05.jpg",
    },
    [{ damage: 200 }, { durablity: 100 }, { attack_speed: 50 }],
    collectionId
  );

  console.log(res);
}

async function update() {
  const res = await revise.fetchNFT("73544e46-d67f-4268-ac13-daeecd97d5e1");
  // console.log(res);
  const nft = revise.nft(res);
  nftt = nft;
  await nft.setProperty("durablity", 97).save();
  revise
    .every("30s")
    .listenTo(API)
    .start(async (data) => {
      await nft.setProperty("damage", 200).save();
    });
}

update();

// export {update};
