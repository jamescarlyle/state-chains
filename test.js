var initState = {count: 0, auctions:[]};
var functions = {
  "fun1":"state.auctions[state.count++] = {ownerAddress: params.ownerAddress, auctionName: params.auctionName}; return state;"
}
var fnstr = functions["fun1"];
var params = {ownerAddress:'abc', auctionName:'toaster'};
var f = new Function('state', 'params', fnstr);
var finalState = f(initState, params)
console.log(finalState);
