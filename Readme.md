# Cryptocurrency slot machine
Cryptocurrency slot machine using Chainlink VRF and 

## Technology Stack & Dependencies

- Solidity (Writing Smart Contract)
- Javascript (Game interaction)
- [Infura](https://infura.io/) As a node provider
- [NodeJS](https://nodejs.org/en/) To create hardhat project and install dependencis using npm


### 1. Clone/Download the Repository

### 2. Install Dependencies:
```
npm install
```

### 3. Deploy contracts
- Create a subscribtion and fund it with LINK. You can create subscription here - https://vrf.chain.link/goerli
- Deploy the Randomizer contract with your subscription ID 
- Add the randomizer contract address as a consumer in the subscription
```
npx hardhat --network goerli run src/backend/scripts/deploy.js
```

### 4. Run the front-end React dapp
```
npm start
```

