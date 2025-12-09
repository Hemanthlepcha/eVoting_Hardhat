const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Get the contract name from command line arguments or use default
  const contractName = process.argv[2] || "votingContract_v2";

  console.log(`\n🚀 Deploying ${contractName} contract...`);

  // Check if contract exists in the contracts directory
  const contractsDir = path.join(__dirname, "..", "contracts");
  const contractFile = `${contractName}.sol`;
  const contractPath = path.join(contractsDir, contractFile);

  if (!fs.existsSync(contractPath)) {
    console.error(`❌ Contract file not found: ${contractFile}`);
    console.log("📋 Available contracts:");

    const files = fs.readdirSync(contractsDir);
    files.forEach((file) => {
      if (file.endsWith(".sol")) {
        console.log(`- ${file.replace(".sol", "")}`);
      }
    });

    process.exit(1);
  }

  try {
    // Get the contract factory
    console.log(`📄 Compiling ${contractName} contract...`);
    const Contract = await hre.ethers.getContractFactory(contractName);

    // Deploy the contract
    console.log("🔄 Deploying to blockchain...");
    const contract = await Contract.deploy();

    // Wait for deployment to complete
    console.log("⏳ Waiting for deployment confirmation...");
    await contract.waitForDeployment();

    // Get the deployed address
    const address = await contract.getAddress();

    console.log(`\n✅ SUCCESS: ${contractName} Contract deployed!`);
    console.log("==============================================");
    console.log(`📝 Contract Address: ${address}`);
    console.log(`🌐 Network: ${hre.network.name}`);
    console.log(`🕒 Timestamp: ${new Date().toLocaleString()}`);
    console.log("==============================================\n");

    // Optional: Save deployment info to a file
    const deploymentInfo = {
      contractName: contractName,
      address: address,
      network: hre.network.name,
      timestamp: new Date().toISOString(),
      explorerLink: getExplorerLink(hre.network.name, address),
    };

    const deploymentsDir = path.join(__dirname, "..", "deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const deploymentFile = path.join(
      deploymentsDir,
      `${contractName}-${hre.network.name}.json`
    );
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

    console.log(`💾 Deployment info saved to: ${deploymentFile}`);

    // Also update .env file if it exists
    updateEnvFile(address);

    return address;
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    if (error.transactionHash) {
      console.log(`📄 Transaction Hash: ${error.transactionHash}`);
    }
    process.exit(1);
  }
}

function getExplorerLink(networkName, address) {
  const explorers = {
    mainnet: "https://etherscan.io/address",
    ropsten: "https://ropsten.etherscan.io/address",
    rinkeby: "https://rinkeby.etherscan.io/address",
    goerli: "https://goerli.etherscan.io/address",
    kovan: "https://kovan.etherscan.io/address",
    polygon: "https://polygonscan.com/address",
    mumbai: "https://mumbai.polygonscan.com/address",
    amoy: "https://amoy.polygonscan.com/address",
    bsc: "https://bscscan.com/address",
    bsctest: "https://testnet.bscscan.com/address",
    avalanche: "https://snowtrace.io/address",
    fuji: "https://testnet.snowtrace.io/address",
    arbitrum: "https://arbiscan.io/address",
    arbitrumgoerli: "https://goerli.arbiscan.io/address",
    optimism: "https://optimistic.etherscan.io/address",
    optimismgoerli: "https://goerli-optimism.etherscan.io/address",
  };

  const baseUrl = explorers[networkName] || explorers.mainnet;
  return `${baseUrl}/${address}`;
}

function updateEnvFile(contractAddress) {
  const envPath = path.join(__dirname, "..", ".env");

  if (!fs.existsSync(envPath)) {
    console.log("⚠️  .env file not found, skipping update");
    return;
  }

  try {
    let envContent = fs.readFileSync(envPath, "utf8");
    const contractAddressLine = `CONTRACT_ADDRESS=${contractAddress}`;

    if (envContent.includes("CONTRACT_ADDRESS=")) {
      // Replace existing contract address
      envContent = envContent.replace(
        /CONTRACT_ADDRESS=.*/,
        contractAddressLine
      );
    } else {
      // Add new contract address
      envContent += `\n${contractAddressLine}\n`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log("✅ Updated .env file with new contract address");
    console.log(
      `🔗 Explorer Link: ${getExplorerLink(hre.network.name, contractAddress)}`
    );
  } catch (error) {
    console.log("⚠️  Could not update .env file:", error.message);
  }
}

main().catch((error) => {
  console.error("❌ Unexpected error:", error);
  process.exitCode = 1;
});
