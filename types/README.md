# Types
Package that provides the type to interact with the smart contracts available [here](https://github.com/desmos-labs/desmos-contracts).  
Inside this directory is also present a ts script that can generate the types 
definitions of the messages to interact with a smart contract.  
This script is a slight modification of the one developed from the **Stargaze** 
team available [here](https://github.com/public-awesome/launchpad/blob/main/types/src/codegen.ts).

# Generate types for a new contract
To generate the type definitions for a new contracts follow these instructions:
1. Create a directory having the contract name inside the `schemas` dir
2. Place the generated json schema inside the previously created dir
3. Move to the root directory of this package
4. Install the node dependencies with `yarn install`
5. Run the code generation with `yarn codegen`
