# eVoting project using hardhat

## How to run the project:
 1. *clone the repo in your local machine* `git clone <git-hub url>`
 2. `cd <folder-name>`
 3. `npm -i`

Try running some of the following tasks:
## To deploy the contract use:
`npx hardhat run scripts/deploy.js --network network-name` <br>
You can change the networks in `deploy.js` file 

## Instruction to use this deployed contract:
- copy the `contract address`
- get the `abi.json` from artifact folder
- use that abi in backend service
  
```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
npx hardhat run scripts/deploy.js --network network-name
```

