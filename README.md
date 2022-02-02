# Join Our [Discord!](https://discord.gg/hF2Sc8jkxZ)

# Auto Bidding Bot
Multiple buy orders *bot* for *OpenSea* with automatic price calculation and Multiple Wallet Support. Unlike others, we plan to have ***long term support*** for the project, we hope to serve the community!

> If something don't work, feel free to create an issue or [Contact us](https://discord.gg/hF2Sc8jkxZ) directly over discord!
> If you need access to a easier to run program (a compiled application), guidance, or you have a new feature or proposal reach out to us over on Discord!

# Demo video
https://user-images.githubusercontent.com/98823274/152195647-19b98db0-9e84-4bd5-8526-5d40356bdc3d.mp4

## Major features
- Multiple Infura keys
- Multiple mnemonics 
- Multiple wallet addresses
- Multiple Opensea keys
- Dynamic bidding price 

## Configuration

### Required settings
- `network` - network name (use `mainnet` or `rinkeby`).
- `infura_keys`  - Infura project id.
- `mnemonics` - MetaMask mnemonic phrase.
- `wallet_addresses` - your wallet address.
- `opensea_keys` - OpenSea API key.
- `exp_time` - expiration time for offer in hours. Default: `24`.
- `opensea_collection_hash` - Collection address.
 - `offset` - It has 2 fields start [ Starting token number ] and end [ ending token number] .
  - `floor price percent` - Specifies bidding price based on percentage of floor price .
  - `fetch_floor_price_at_bid_no` - Number of bids after which floor price is fetched.


Default config file: `config.json`.

```json
{
"opensea_collection_hash": "0x60e4d786628fea6478f785a6d7e704777c86a7c6",
"infura_keys": ["7e6b439b25cd4544d54g6cc557b695e8"],
"mnemonics": ["ox cow wool land stone ....."],
"wallet_addresses": ["0x85tyD10b8fg47j6f49b57e4121C576BB4Aa4A979"],
"opensea_keys": ["sad4s6d5s4d68ew4d6e5wd","dhgwedwefdhgwefdg6564"],
"offset": { "start": 500, "end": 1000 },
"exp_time": 0.5,
"floor_price_percent": 0.01,
"fetch_floor_price_at_bid_no": 200,
}
```

## How to Install
- Install `node.js`, `git` on your device
- Dwnload or `git clone <link>` the repository! 
- Run `yarn install` inside the folder

If you need assistance reach out to us on [Discord.](https://discord.gg/hF2Sc8jkxZ). We also have the compiled and easy installation of the project in case you need it.

## Usage
You should have an Infura key, an OpenSea API key, an OpenSea account and a MetaMask account.

- Edit `config.json` file.
- Run `node index.js`.

# Now you can run the Bot - Happy Bidding !!!

# Disclaimer
> This is for educational and demonstration purposes ONLY. We are not responsible for any incurred losses or mistypes information. PLease go through the needed documentation and be very cautious with automatic trading!
