# Types
Package that provides the types to interact with the available smart contracts [here](https://github.com/desmos-labs/desmos-contracts).  
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

# Download schemas

To download all needed schemas, you can run the `pull-schemas` script.
This script will download the generated schemas `json` files from the `master` branch of the needed repositories 
and place them inside the proper `*-schemas` directory.

If you want to download from the specified `branch`, `tag` or `commit`, please use the following command instead.

## Download cw721-base schemas from the cw-nfts repo
To download the cw721-base schemas from the **cw-nfts** repo, you can run the `pull-cw721-schemas` script.   
This script will download the generated schemas `json` files from the repository and place them inside the `cw721-schemas`
directory.
You can specify from where the schemas should be downloaded with one of the following argument:
* `--branch` specify the branch from where will be downloaded the schemas
* `--tag` specify the git tag from where will be downloaded the schemas
* `--commit` specify the git commit from where will be downloaded the schemas  

If none of the following arguments is passed the script will download the schemas from the `master` branch. 


## Download contract schemas from the desmos-contracts repo
To download the schemas from the **desmos-contracts** repo, you can run the `pull-contract-schemas` script.   
This script will download the generated schemas `json` files from the repository and place them inside the `schemas`
directory.
You can specify from where the schemas should be downloaded with one of the following argument:
* `--branch` specify the branch from where will be downloaded the schemas
* `--tag` specify the git tag from where will be downloaded the schemas
* `--commit` specify the git commit from where will be downloaded the schemas  

If none of the following arguments is passed the script will download the schemas from the `master` branch. 
