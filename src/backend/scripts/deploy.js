async function main() {

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Randomizer Contract
  const Randomizer = await ethers.getContractFactory('Randomizer');
  const randomizer = await Randomizer.deploy(1327); // TODO change subscription id
  await randomizer.deployed();

  console.log("Randomizer Contract was deployed to Address: ", randomizer.address);

  //Slot Machine Contract
  const SlotMachine = await ethers.getContractFactory('SlotMachine');
  const slotMachine = await SlotMachine.deploy(randomizer.address);
  await slotMachine.deployed();

  console.log("Slot Machine Contract was deployed to Address: ", slotMachine.address);

  // For each contract, pass the deployed contract and name to this function to save a copy of the contract ABI and address to the front end.
  saveFrontendFiles(randomizer, 'Randomizer');
  saveFrontendFiles(slotMachine, 'SlotMachine');
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../frontend/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
