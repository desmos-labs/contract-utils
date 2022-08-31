# Utils
Set of utility functions to interact with the Desmos available smart contracts [here](https://github.com/desmos-labs/desmos-contracts).


## Setup guide
If you have already node and yarn installed on you system you can skip this section.

Get the latest version of node for your OS from [here](https://nodejs.org/en/download).  
After installing node to install yarn just run `npm install --global yarn`, you can then check that yarn is 
installed by running `yarn --version`.

## How to use
Create a copy of the `config.examples.ts` and name it `config.ts` and modify it according your needs.  
To execute the scripts then run `yarn utils:$SCRIP_NAME` from the root directory of this project.

## Scripts
* `upload-contract`: Allow to upload a compiled CosmWASM contract to the chain.
* `poap`: Utility script to interact with the poap contract available [here](https://github.com/desmos-labs/desmos-contracts/tree/master/contracts/poap).
* `poap-manager`: Utility script to interact with the poap manager contract available [here](https://github.com/desmos-labs/desmos-contracts/tree/master/contracts/poap-manager).
