**总体流程**
- 配置环境变量，指向你的 AIVerse 测试网账户私钥
- 编译合约，部署 `TEEVerifier` 和 `AgentNFT`（BeaconProxy）
- 运行 mint 脚本，传入符合验证器要求的 `proofs` 与 `dataDescriptions`
- 在 ChainScan 验证合约与交易

**准备环境**
- 在项目根目录创建或更新 `dev.env`（！！！！！）
- 必填变量：
  - `ZG_TESTNET_PRIVATE_KEY=0x你的私钥（64位十六进制，带0x前缀）`（点开你插件的头像然后有个查看密钥）
- 可选变量（不填用默认）：
  - `ZG_NFT_NAME`、`ZG_NFT_SYMBOL`、`ZG_RPC_URL`、`ZG_INDEXER_URL`
- 环境变量加载位置：`hardhat.config.ts:6-7`
- 自动加载 `dev.env`：`hardhat.config.ts:8-12`

**编译与部署**
- 安装依赖：`pnpm install`
- 编译：`pnpm hardhat compile`
- 部署到 AIVerse 测试网（0G Galileo）：`pnpm hardhat deploy --network zgTestnet`
  - 初始化参数来源：`scripts/deploy/deploy.ts:16-20`
  - 初始化编码与代理部署：`scripts/deploy/deploy.ts:22-39`
  - 网络配置（链 ID 已设置为 16602）：`hardhat.config.ts:48-54`

**在 AIVerse 测试网 mint iNFT**
- 运行：`pnpm hardhat run scripts/mint.ts --network zgTestnet`
- 脚本逻辑要点：
  - 构造两个 `dataDescriptions` 与两个 32 字节 `proofs`（`TEEVerifier` 要求）
  - 使用代理地址连接 `AgentNFT` 并调用 `mint`
- `TEEVerifier` 预映像校验：`contracts/verifiers/TEEVerifier.sol:18-33`
- `iNFT` 的 `mint` 接口与实现：
  - 接口：`contracts/interfaces/IERC7857.sol:46-55`
  - 实现：`contracts/AgentNFT.sol:134-177`

**验证与查看**
- 部署产物（代理、Beacon、实现、Verifier 地址）存放：
  - `deployments/zgTestnet/AgentNFT.json`、`AgentNFTBeacon.json`、`AgentNFTImpl.json`、`TEEVerifier.json`
- 代理地址（交互入口）：可从 `deployments/zgTestnet/AgentNFT.json` 的 `"address"` 字段读取
- ChainScan 查看
  - 代理地址示例：`https://chainscan-galileo.0g.ai/address/0x83d5518f13332E541697Cac7691FFD5ed08fA00e`
  - Beacon：`https://chainscan-galileo.0g.ai/address/0xb145da830Aa9172C8373491c4544da182F4B59F6`
  - 实现：`https://chainscan-galileo.0g.ai/address/0xDF2eE03ceE31d96fb91565bd5BDf1Bed725aD1A6`
  - TEEVerifier：`https://chainscan-galileo.0g.ai/address/0x17f2c88a0020b85c13e9b895aEf4F99b9d114393`
  - mint 交易示例：`https://chainscan-galileo.0g.ai/tx/0x8b30006d6bc135a30aa5682f28ffe880485a879369192228abefefc88d47d31a`
- 快速校验脚本（可选）：`pnpm hardhat run scripts/check_owner.ts --network zgTestnet`

**自定义你的 iNFT 内容**
- 在 `scripts/mint.ts` 替换：
  - `descriptions` 为你的模型/数据描述
  - `proofs` 为真实的 32 字节校验哈希（或后续接入 ZKP 方案时按 `ZKPVerifier` 的输入格式）
- `tokenURI` 返回链与索引器地址的 JSON：`contracts/AgentNFT.sol:307-320`

**常见问题**
- 账户私钥必须是 `0x` 前缀且总长度 66；否则不会被加载：`hardhat.config.ts:13-19, 48-54`
- 如果出现链 ID 不匹配报错，使用当前配置的 `16602`：`hardhat.config.ts:50`
- 如果提示 `No Contract deployed with name: AgentNFT`，先运行部署命令
- 如果调用报 `staticCall` 相关错误，确保通过代理地址 `getContractAt("AgentNFT", <proxyAddress>)` 连接（已在 `scripts/mint.ts` 修正）
