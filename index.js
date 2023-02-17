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

async function main(rate) {
  const moneyRouterAddress = "0x6cE360db8Cb15d3D963608A0675CF67862311043";

  const receiver = "0x9aCEcAF7e11BCbb9c114724FF8F51930e24f164b";

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

async function stremeupdate(rate) {
  const moneyRouterAddress = "0x6cE360db8Cb15d3D963608A0675CF67862311043";

  const receiver = "0x9aCEcAF7e11BCbb9c114724FF8F51930e24f164b";

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
  console.log("daix", daix);

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

const all = [
  {
    condition: "Neutral",
    image: "https://i.ibb.co/bRmpNVM/Frame-62.gif",
  },
  {
    condition: "Better",
    image: "https://i.ibb.co/p3LXdZN/Frame-100.gif",
  },
  {
    condition: "Worse",
    image: "https://i.ibb.co/hHPMMMK/Frame-61.gif",
  },
  {
    condition: "Neutral",
    image: "https://i.ibb.co/4dXWQhC/Frame-57.gif",
  },
  {
    condition: "Better",
    image: "https://i.ibb.co/pjKpGBB/Frame-99.gif",
  },
  {
    condition: "Worse",
    image: "https://i.ibb.co/2KRymZk/Frame-58.gif",
  },
  {
    condition: "Neutral",
    image: "https://i.ibb.co/2nVHNsh/Frame-97.gif",
  },
  {
    condition: "Better",
    image: "https://i.ibb.co/tZgTN0s/Frame-98.gif",
  },
  {
    condition: "Worse",
    image: "https://i.ibb.co/rm1j0FG/Frame-96.gif",
  },
];

async function API() {
  // let randomindex = Math.floor(Math.random() * 9);
  // return all[randomindex];
  let revisions = await revise.fetchRevisions(nft_id);
  let dura1 = revisions?.revisions[0]?.metaData[1]?.durablity;
  let dura2 = revisions?.revisions[1]?.metaData[1]?.durablity;

  if (dura1 < dura2 && dura2 < 100) {
    console.log("durablity is reduced : updating streame");
    main("185802469135802");
    // stremeupdate("385802469135802");
  } else if (dura1 < dura2 && dura2 == 100) {
    main("185802469135802");
  } else {
    console.log("durablity is constant : not updating streame");
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
  await nft.setProperty("durablity", 96).save();
  revise
    .every("10s")
    .listenTo(API)
    .start(async (data) => {
      await nft.setProperty("damage", 200).save();
    });
}

update();
