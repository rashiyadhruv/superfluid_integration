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

let nftt = null;

async function main () {
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

  await moneyRouter
    .connect(signers[0])
    .createFlowFromContract(daix.address, receiver, "185802469135802")
    .then(function(tx) {
      console.log(`
        Congrats! You just successfully created a flow from the money router contract. 
        Tx Hash: ${tx.hash} , signers[0] : ${signers[0]}
    `);
    });
};

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
  
  if (nftt?.nft?.metaData[1].durablity < 100  ) {
    console.log("durablity is not full : starting streme");
    main();

  } else {
    console.log("durablity is full");
  }
  // console.log("API called heheheheh", nftt);
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
  const nft = revise.nft(res);
  nftt = nft;
  revise
    .every("100s")
    .listenTo(API)
    .start(async (data) => {
      await nft
      .setProperty('durablity', 99)
      .save();
    });
}

update();
