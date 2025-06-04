# Egyptian Car Plate NFT

## About This Project

### Project Description
This project is a unique NFT platform that allows users to mint Egyptian car license plates as NFTs. Users can input their car plate number, and the system will automatically generate a visual representation of their Egyptian license plate with the exact numbers and letters. The generated plate image is uploaded to IPFS via Pinata, and then minted as an NFT on the Scroll Sepolia testnet.

The project extends beyond simple minting by including an auction system where users can list their plate NFTs for sale, creating a marketplace for unique Egyptian car plate collectibles.

🌐 **Live Platform**: [https://blokkat-arabic-blockchain-developer-flame.vercel.app/](https://blokkat-arabic-blockchain-developer-flame.vercel.app/)

### Key Features
- **Plate Generation**: Automatic visual generation of Egyptian license plates based on user input
- **IPFS Integration**: Decentralized storage of plate images and metadata via Pinata
- **NFT Minting**: Smart contract-based minting of unique plate NFTs
- **Web3 Integration**: Full blockchain integration with wallet connectivity
- **Auction System**: Marketplace functionality for trading plate NFTs [coming soon]

### Directory Structure

```
/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── metadataURI/          # Metadata generation endpoint
│   │   └── pltPicGen/            # Plate image generation endpoint
│   ├── favicon.ico
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout component
│   └── page.tsx                  # Main page component
├── components/                   # React components
│   ├── Header.tsx                # Navigation header
│   ├── MintNFT.tsx               # NFT minting interface
│   ├── NFTCard.tsx               # Individual NFT display card
│   ├── OwnedNFTList.tsx          # User's owned NFTs list
│   └── SearchNFT.tsx             # NFT search functionality
├── config/                      
│   └── index.tsx                 # Configuration for reown [connect wallet]
├── context/                      
│   └── index.tsx                 # context provider for reown [connect wallet]
├── lib/
│   ├── plateGen.js               # License plate image generator
│   ├── config.js                 # configuration for plateGen.js
│   ├── JsonMaker.js              # JSON metadata generator
│   └── wagmiSolConfig.ts         # reown configuration [contract address , ABI]
│
├── public/                       # car plate picture assets
│   ├── Background/               # Background images
│   ├── letters/                  # Arabic letter
│   └── numbers/                  # Number
│
├── Smart Contracts/              # Blockchain smart contracts
│   ├── foundry.toml              # Foundry configuration
│   ├── script/                   # Deployment scripts
│   │   ├── EgyptPlateNFT.s.sol
│   │   ├── Factory.s.sol
│   │   └── PlateAuction.s.sol
│   ├── src/                      # Contract source code
│   │   ├── EgyptPlateNFT.sol     # Main NFT contract
│   │   ├── Factory.sol           # Contract factory
│   │   └── PlateAuction.sol      # Auction functionality
│   └── test/                     # Contract tests
│       ├── EgyptPlateNFT.t.sol
│       ├── Factory.t.sol
│       └── PlateAuction.t.sol
└── Configuration files (package.json, next.config.ts, etc.)
```

## Design Patterns

This project implements several important design patterns from the technical requirements:

### 1. Factory Pattern
**Location**: `Smart Contracts/src/Factory.sol`

The Factory pattern is implemented to manage the creation and deployment of auction contracts. Instead of manually deploying individual auction contracts for each NFT, the Factory contract provides a standardized way to create new auction instances.

**Implementation Details**:
- The Factory contract contains functions to deploy new PlateAuction contracts
- Each auction is created with specific parameters (NFT contract address, token ID, etc.)
- The factory maintains a registry of all created auctions

### 2. Inheritance and Interfaces
**Location**: `Smart Contracts/src/EgyptPlateNFT.sol`

The project extensively uses inheritance by importing and extending OpenZeppelin contracts, which is a fundamental design pattern in Solidity development.

**Implementation Details**:
```solidity
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract EgyptPlateNFT is ERC721 {
    // Contract inherits from both ERC721 and Ownable
}
```

- **ERC721 Inheritance**: Provides standard NFT functionality (minting, transferring, ownership)
- This pattern promotes code reusability and follows established standards

## How to Run the Program

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MetaMask or compatible Web3 wallet
- Git

### Local Server Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/AbdoViper23/blokkat-arabic-blockchain-developer-bootcamp-graduation-project.git
   cd blokkat-arabic-blockchain-developer-bootcamp-graduation-project
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory with the following structure:
   ```env
   NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token_here
   
   # Pinata Configuration (Required for IPFS uploads)
   PINATA_API_KEY=your_pinata_api_key_here
   PINATA_SECRET_API_KEY=your_pinata_secret_key_here
   
   ```

4. **Smart Contract Deployment** (if not already deployed)
   ```bash
   cd "Smart Contracts"
   forge install
   forge build
   forge script script/EgyptPlateNFT.s.sol --rpc-url https://sepolia-rpc.scroll.io/ --broadcast --verify
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Required Environment Variables Setup

To properly configure your `.env.local` file, you need to obtain the following:

**Pinata IPFS Service:**
1. Sign up at [pinata.cloud](https://pinata.cloud)
2. Generate API keys from your dashboard
3. Copy the API key, and secret key

**Smart Contract Addresses:**
1. Deploy the contracts using Foundry (see commands above)
2. Copy the deployed contract addresses from the deployment output
3. Alternatively, use the already deployed contracts (addresses will be provided in releases)

**Wallet Configuration:**
1. Add Scroll Sepolia testnet to your MetaMask
2. Get testnet ETH from Scroll Sepolia faucet
3. Ensure your wallet is connected to the correct network

## Demo

### Live Demo Video
🎥 **Demo Video**: [Watch Complete Walkthrough](https://drive.google.com/file/d/1rhA_Tp7gnTtssytB1vm4WRx1d7Hn3SzI/view?usp=sharing)

---

## Technical Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Blockchain**: Solidity, Foundry, Scroll Sepolia
- **Web3**: Wagmi
- **Storage**: IPFS via Pinata
- **Styling**: Tailwind CSS
- **Image Generation**: Canvas API

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests for any improvements.

---

**Project Status**: Active Development
**Blockchain**: Scroll Sepolia Testnet
