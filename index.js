const fs = require("fs");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { OpenSeaPort, Network } = require("opensea-js");
const axios = require("axios");
const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

const {
  opensea_collection_hash,
  floor_price_percent,
  fetch_floor_price_at_bid_no,
  mnemonics,
  infura_keys,
  opensea_keys,
  wallet_addresses,
  exp_time,
  offset,
  gas_price,
} = config;

const delay = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const getProvider = (idx) => {
  idx = idx % mnemonics.length;
  console.log("Connecting with provider...");
  console.log("Switching mnemonic");
  const provider = new HDWalletProvider({
    mnemonic: {
      phrase: mnemonics[idx],
    },
    providerOrUrl: `wss://mainnet.infura.io/ws/v3/${infura_keys[idx]}`,
    pollingInterval: 8000,
  });
  if (!provider) {
    console.log("Failed to connect with provider");
  }
  console.log("Successfully connected with provider");
  return provider;
};

const getSeaportConfig = (idx) => {
  idx = idx % opensea_keys.length;
  console.log("Switching seaport key");
  let apiConfig = {
    networkName: Network.Main,
    apiKey: opensea_keys[idx],
  };
  if (gas_price > 0) apiConfig.gas_price = gas_price;
  return apiConfig;
};

let seaportConfig;
let provider;
const initSeaport = (idx) => {
  console.log("Initializing Seaport");
  seaportConfig = getSeaportConfig(idx);
  provider = getProvider(idx);
  const seaport = new OpenSeaPort(provider, seaportConfig);
  if (!seaport) {
    console("Failed to initialize seaport!!!");
    return;
  }
  console.log("Successfully initiated seaport");
  return seaport;
};

const getAssetFloorPrice = async (assetSlug) => {
  const options = {
    method: "GET",
    url: `https://api.opensea.io/api/v1/collection/${assetSlug}`,
  };
  const response = await axios.request(options);
  return response.data.collection.stats.floor_price * floor_price_percent;
};

const makeOffer = async (seaport, idx, tokenAddress, tokenId, assetPrice) => {
  if (!seaport) {
    console.log("No seaport instance found");
    return;
  }
  try {
    let floorPrice;
    if (idx % fetch_floor_price_at_bid_no === 0 || idx === 1) {
      const asset = await seaport.api.getAsset({
        tokenAddress: tokenAddress,
        tokenId: tokenId,
      });
      const assetSlug = asset.collection.slug;
      floorPrice = await getAssetFloorPrice(assetSlug);
    }
    if (floorPrice > 0) {
      assetPrice = floorPrice;
    }
    assetPrice.toFixed(4);
    console.log(
      `\n   ${idx} Processing...` +
        `\n     Address: ${tokenAddress}` +
        `\n     Id:      ${tokenId}` +
        `\n     Price:   ${assetPrice}`
    );
    const createBuyOrderPayload = getCreateBuyOrderPayload(
      idx,
      tokenId,
      tokenAddress,
      assetPrice
    );
    await seaport.createBuyOrder(createBuyOrderPayload);
    console.log(
      `\n * ${idx} Offer succeed.` +
        `\n     Address: ${tokenAddress}` +
        `\n     Id:      ${tokenId}` +
        `\n     Price:   ${assetPrice}`
    );
  } catch (error) {
    if (error.message && error.message.includes("API Error 429")) {
      console.log(`   ${idx} Request was throttled. Trying again...`);
      makeOffer(seaport, idx, opensea_collection_hash, tokenId, assetPrice);
    } else if (error.message && error.message.includes('{"success":false}')) {
      console.log(` ! ${idx} Request failed. 404 API error.`);
    } else {
      console.log(` ! ${idx} Request failed. Internal error due processing.`);
      console.log(error.message);
    }
  }
};

const getCreateBuyOrderPayload = (idx, tokenId, tokenAddress, startAmount) => {
  idx = idx % wallet_addresses.length;
  console.log("Changing wallet address");
  return {
    asset: {
      tokenId: tokenId,
      tokenAddress: tokenAddress,
    },
    accountAddress: wallet_addresses[idx],
    expirationTime: Math.round(Date.now() / 1000 + 60 * 60 * exp_time),
    startAmount: startAmount,
  };
};

let assetPrice = 0;
const main = async () => {
  try {
    for (let idx = 1; idx <= offset.end - offset.start + 1; idx++) {
      const seaport = initSeaport(idx);
      const tokenId = offset.start + idx - 1;
      console.log(
        `\n   ${idx} Scheduling...` +
          `\n     Address: ${opensea_collection_hash}` +
          `\n     Id:      ${tokenId}` +
          `\n     Price:   ${assetPrice}`
      );
      makeOffer(seaport, idx, opensea_collection_hash, tokenId, assetPrice);
      await delay(Math.ceil(5000 / opensea_keys.length));
    }
    console.log("Bidding Completed!");
  } catch (error) {
    console.log(error);
  }
};

main();
