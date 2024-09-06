# Milky Adverb

Milky Adverb is a cross-chain word game that leverages LayerZero for seamless multi-chain interactions and Cartesi Rollups for off-chain computation. This project demonstrates how to create a chain-agnostic game that can be played from any supported blockchain while maintaining a unified game state.

## Project Structure

The project is divided into three main folders:

1. `onchain`: Contains smart contracts for LayerZero integration, Solidity code, and Hardhat environment.
2. `rollups`: Contains game logic and computation, built with Cartesi Rollups, Deroll, and TypeScript.
3. `web`: Contains the frontend application built with Next.js, Zustand, TailwindCSS, Wagmi, Viem, and Shadcn UI.

### Onchain

The `onchain` folder contains the smart contracts that handle cross-chain communication and input forwarding to Cartesi Rollups. Key components include:

- Hardhat configuration for deploying and testing contracts.
- Scripts for setting up LayerZero peers and managing cross-chain communication.

### Rollups

The `rollups` folder contains the off-chain computation logic for the word game. It's built using Cartesi Rollups and Deroll framework. Key components include:

- Game state management
- Word validation and scoring logic
- Player management and leaderboard calculations

### Web

The `web` folder contains the frontend application. It's built with modern web technologies to provide a seamless user experience. Key components include:

- Next.js for server-side rendering and routing
- Zustand for state management
- TailwindCSS for styling
- Wagmi and Viem for blockchain interactions
- Shadcn UI for pre-built UI components

## Features

- Cross-chain gameplay: Play the game from any supported blockchain.
- Unified game state: Maintain a single game state across all chains.
- Off-chain computation: Leverage Cartesi Rollups for complex game logic and reduced gas costs.
- Responsive UI: Enjoy a seamless gaming experience on desktop and mobile devices.

## Getting Started

### Prerequisites

- Node.js (v22 or later)
- Yarn or npm
- Docker (for running Cartesi Rollups)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/masiedu4/milky_adverb.git
   cd milky-adverb
   ```

2. Install dependencies for each part of the project:
   ```
   cd onchain && yarn install
   cd ../rollups && yarn install
   cd ../web && yarn install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in each folder and fill in the required values.

### Running the Project

1. Start the Cartesi Rollups environment:
   ```
   cd rollups
   docker-compose up
   ```

2. Deploy the smart contracts:
   ```
   cd onchain
   npx hardhat run scripts/deploy.js --network <your-network>
   ```

3. Start the frontend application:
   ```
   cd web
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000` to play the game.

## Testing

- Run smart contract tests:
  ```
  cd onchain
  npx hardhat test
  ```

- Run Cartesi Rollups tests:
  ```
  cd rollups
  yarn test
  ```

- Run frontend tests:
  ```
  cd web
  yarn test
  ```

## Deployment

1. Deploy smart contracts to desired networks using Hardhat.
2. Deploy Cartesi Rollups to a hosting provider that supports Docker.
3. Deploy the frontend to a hosting service like Vercel or Netlify.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [LayerZero](https://layerzero.network/) for enabling cross-chain communication.
- [Cartesi](https://cartesi.io/) for providing the off-chain computation environment.
- [Deroll](https://github.com/tuler/deroll) for simplifying Cartesi Rollups development.
- All the amazing open-source libraries and frameworks used in this project.