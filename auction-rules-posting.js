{
  "rules": [
    {"func": "function(state, params) {var auctions = state.auctions;auctions[state.count++] = {id: state.count, ownerAddress: params.ownerAddress, auctionName: params.auctionName, endTime: params.endTime, bids: []};}"}
    ,
    {"func": "function(state, params) {var auction = state.auctions[params.id];auction.bids.push({bidderAddress: params.bidderAddress, bidAmount: params.bidAmount, bidTime: Date.now()});}"}
  ]
}
{
  "rules": {
    "createAuction": "var auctions = state.auctions;auctions[state.count++] = {id: state.count, ownerAddress: params.ownerAddress, auctionName: params.auctionName, endTime: params.endTime, bids: []}; return state;",
    "placeBid": "var auction = state.auctions[params.id];auction.bids.push({bidderAddress: params.bidderAddress, bidAmount: params.bidAmount, bidTime: Date.now()}); return state;"
  }
}
