const { ethers } = require("hardhat");

async function main() {
    console.log("\n=== Deploying Anonymous Property Voting Contract ===\n");

    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    const balance = await deployer.getBalance();
    console.log("Account balance:", ethers.utils.formatEther(balance), "ETH\n");

    // Deploy contract
    const Contract = await ethers.getContractFactory("AnonymousPropertyVoting");
    const contract = await Contract.deploy();

    await contract.deployed();

    console.log("✅ Contract deployed successfully!");
    console.log("\n📋 Deployment Info:");
    console.log("  Contract Address:", contract.address);
    console.log("  Transaction Hash:", contract.deployTransaction.hash);
    console.log("  Deployer (Manager):", deployer.address);
    console.log("\n🔗 View on Explorer:");
    console.log("  https://sepolia.etherscan.io/address/" + contract.address);

    // Save deployment info
    const fs = require('fs');
    const deploymentInfo = {
        contractName: "AnonymousPropertyVoting",
        address: contract.address,
        deployer: deployer.address,
        transactionHash: contract.deployTransaction.hash,
        network: network.name,
        deployedAt: new Date().toISOString()
    };

    fs.writeFileSync(
        'deployment.json',
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("\n✅ Deployment info saved to deployment.json\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Deployment failed:", error);
        process.exit(1);
    });
