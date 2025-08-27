const hre = require("hardhat");

async function main() {
  console.log("Deploying Voting contract...");

  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();

  // Wait for deployment to complete
  await voting.waitForDeployment();

  // Get the contract address
  const contractAddress = await voting.getAddress();

  console.log("✅ Voting Contract deployed successfully!");
  console.log(`📋 Contract Address: ${contractAddress}`);

  // Return the address for potential use in other scripts
  return contractAddress;
}

main()
  .then((address) => {
    console.log("🎉 Deployment completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exitCode = 1;
  });