import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  const proxy = await ethers.getContract("AgentNFT");
  const address = await proxy.getAddress();
  const agentNFT = await ethers.getContractAt("AgentNFT", address);

  const descriptions = [
    "Model weights hash",
    "Dataset checksum",
  ];

  const hashes = [
    ethers.keccak256(ethers.toUtf8Bytes("weights_v1")),
    ethers.keccak256(ethers.toUtf8Bytes("dataset_2024_10")),
  ];

  const proofs: string[] = hashes;

  const tokenId = await agentNFT.mint.staticCall(
    proofs,
    descriptions,
    deployer.address
  );

  const tx = await agentNFT.mint(proofs, descriptions, deployer.address);
  const receipt = await tx.wait();

  console.log("Mint tx hash:", receipt?.hash);
  console.log("Minted tokenId:", Number(tokenId));
  const owner = await agentNFT.ownerOf(tokenId);
  console.log("Owner:", owner);
  const uri = await agentNFT.tokenURI(tokenId);
  console.log("TokenURI:", uri);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

