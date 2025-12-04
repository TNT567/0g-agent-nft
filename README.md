
如何独立完成在 AIVerse（0G Galileo 测试网）部署 iNFT 合约并在其上 mint 一个 iNFT

**你需要做的**
- 每一步只用复制命令、按说明操作即可；不用改代码

**准备环境**
- 安装 Node.js（建议 LTS）和 pnpm
- 打开终端，进入项目目录：`d:\项目合集\0g-agent-nft`

**配置钱包与环境变量**
- 获取你的测试网地址对应的私钥（例如在 MetaMask：账户详情 → 导出私钥），注意不是地址
- 打开并填写环境文件：`d:\..\0g-agent-nft\dev.env`
- 内容示例（你已写好，确保私钥正确）
  ```
  ZG_TESTNET_PRIVATE_KEY=0x你的私钥（64位十六进制，带0x前缀）
  ZG_NFT_NAME=My iNFT
  ZG_NFT_SYMBOL=MYAI
  ZG_RPC_URL=https://evmrpc-testnet.0g.ai
  ZG_INDEXER_URL=https://indexer-storage-testnet-turbo.0g.ai
  ```
- 项目会自动加载该文件（`hardhat.config.ts:6-12`）

**安装与编译**
- 安装依赖：`pnpm install`
- 编译合约：`pnpm hardhat compile`

**部署到测试网**
- 运行部署命令：`pnpm hardhat deploy --network zgTestnet`
- 这一步会自动部署：
  - 验证器 `TEEVerifier`
  - `AgentNFT` 的实现合约与 Beacon
  - 代理合约（交互入口）并完成初始化
- 网络配置（链 ID 16602）：`hardhat.config.ts:48-54`
- 初始化参数来源：`scripts/deploy/deploy.ts:16-20`

**在测试网 mint 一个 iNFT**
- 运行：`pnpm hardhat run scripts/mint.ts --network zgTestnet`
- 脚本会：
  - 构造两条数据描述与对应 32 字节哈希（满足验证器格式要求）
  - 通过代理地址调用 `mint` 完成铸造
- iNFT `mint` 定义：`contracts/interfaces/IERC7857.sol:46-55`
- iNFT `mint` 实现：`contracts/AgentNFT.sol:134-177`
- TEE 预映像证明格式要求（每个 `proof` 必须是 32 字节）：`contracts/verifiers/TEEVerifier.sol:18-33`

**在链上查看**
- 部署产物（含地址与交易哈希）位于：
  - `deployments/zgTestnet/AgentNFT.json`（代理地址）
  - `deployments/zgTestnet/AgentNFTBeacon.json`
  - `deployments/zgTestnet/AgentNFTImpl.json`
  - `deployments/zgTestnet/TEEVerifier.json`
- 打开浏览器，复制上述地址到 ChainScan（Galileo）：
  - 代理地址示例：`https://chainscan-galileo.0g.ai/address/<AgentNFT.json里的address>`
- 交易哈希也可在脚本输出中直接点开，如示例：
  - `https://chainscan-galileo.0g.ai/tx/0x8b30006d6bc135a30aa5682f28ffe880485a879369192228abefefc88d47d31a`

**常见问题与解决**
- 私钥格式错误
  - 必须以 `0x` 开头，总长度 66；否则不会加载（`hardhat.config.ts:13-19, 48-54`）
- 链 ID 不匹配
  - 已设置为 `16602`；正常无需改（`hardhat.config.ts:50`）
- 提示 “No Contract deployed with name: AgentNFT”
  - 确认先执行了部署命令，再运行 mint

**你需要**
- 环境文件 `dev.env`
  
**完整命令清单（复制即用）**
- `pnpm install`
- `pnpm hardhat compile`
- `pnpm hardhat deploy --network zgTestnet`
- `pnpm hardhat run scripts/mint.ts --network zgTestnet`

如果你希望把自己的模型或数据描述换成真实内容，只需要打开 `scripts/mint.ts`，把脚本里的 `descriptions` 和 `proofs` 替换成你的描述与对应的 32 字节哈希即可，其余流程不变。
