const hre = require("hardhat");

async function main() {
  const Voting = await hre.ethers.getContractFactory("Voting");

  console.log("Deploying contract...");

  const voting = await Voting.deploy();

  await voting.deploymentTransaction().wait(); 

  console.log(`Voting Contract deployed to: ${voting.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
