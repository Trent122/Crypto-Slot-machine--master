async function main() {

    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    // Randomizer Contract
    const Randomizer = await ethers.getContractFactory('Randomizer');
    const randomizer = await Randomizer.deploy(1120); //subscription ID - Please Change
    await randomizer.deployed();
  
    // const tx = await randomizer.requestRandomWords({gasLimit: 10000000});
    // await tx.wait();
  
    console.log("Randomizer Contract was deployed to Address: ", randomizer.address);
  
  
    // await randomizer.s_requestId();
    // For each contract, pass the deployed contract and name to this function to save a copy of the contract ABI and address to the front end.
    saveFrontendFiles(randomizer, 'Randomizer');
  }
  
  function saveFrontendFiles(contract, name) {
    const fs = require("fs");
    const contractsDir = __dirname + "/../../frontend/contractsData";
    const contractsDirBack = __dirname + "/randAddress";
  
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }

    if (!fs.existsSync(contractsDirBack)) {
        fs.mkdirSync(contractsDirBack);
      }
  
    fs.writeFileSync(
      contractsDir + `/${name}-address.json`,
      JSON.stringify({ address: contract.address }, undefined, 2)
    );

    fs.writeFileSync(
        contractsDirBack + `/${name}-address.json`,
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
  