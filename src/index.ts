import bgold = require('bgoldjs-lib');

const keyPair = bgold.ECPair.makeRandom({ network: bgold.networks.bitcoingoldtestnet });

//You have to request some BTG for this address first. (You can search for "Bitcoin Gold testnet faucet")
const { address } = bgold.payments.p2pkh({ pubkey: keyPair.publicKey, network: bgold.networks.bitcoingoldtestnet});

console.log(address);

const SIGHASH = bgold.Transaction.SIGHASH_ALL | bgold.Transaction.SIGHASH_FORKID;

/*
You have to fetch the data for the transaction that sends BTG to your address. (You can use "axios" for example)

    let tx = response.data;
    let txid = tx.txid;
    let utxo = tx.vout[1];
    let index = utxo.n;
*/

//And after that you start creating your transaction with the fetched data

let psbt  = new bgold.Psbt({ network: bgold.networks.bitcoingoldtestnet });

psbt.addInput({
	hash: txid,
	index: n,
	nonWitnessUtxo: Buffer.from(tx.hex, 'hex'),
	sighashType: SIGHASH,
});


//This is the address where your transaction will send the BTG
const addressToSend = ".........................................";

psbt.addOutput({ address: addressToSend, value: 100000000  -  10000 });

psbt.signInput(0, keyPair, [SIGHASH]);

psbt.finalizeInput(0);

console.log(psbt.extractTransaction().toHex());
