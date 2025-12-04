import { ethers } from "hardhat";

async function main() {
  const agentNFT = await ethers.getContract("AgentNFT");
  const owner = await agentNFT.ownerOf(0);
  const desc = await agentNFT.dataDescriptionsOf(0);
  const hashes = await agentNFT.dataHashesOf(0);
  console.log("tokenId 0 owner:", owner);
  console.log("descriptions:", desc);
  console.log("hashes:", hashes);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

