const bitcoin = require("bitcoinjs-lib");
const chalk = require('chalk');


console.log(chalk.blue.bold("N:B This is a mock Example, and will not run because tx has no input"));



console.log( '\n', chalk.blue.bgRed.bold('To test:') + " " + chalk.red('Make') + " " + chalk.blue.bold('Variable WIFS') + ("  ") + chalk.green('an array of private keys of p2sh-p2wpkh output'), '\n');


console.log( '\n', chalk.blue.bgRed.bold('Optional:') + " " + chalk.red('Also change') + " " + chalk.blue.bold('Variable hardwalletAddress') + ("  ") + chalk.green('to desired recipient address') + " " + chalk.blue.bold(''), '\n');





//creating and signing a p2sh segwit
//p2sh(p2wpkh): addInput('00000....', 0)
//sign(0, keyPair, redeemScript, ,value)

let NETWORK = bitcoin.networks.bitcoin;
let txb = new bitcoin.TransactionBuilder(NETWORK);

//get unspent output details
let txid = ""; //transaction id of the output you want to spend
let outn = 0;  // n out

let WIFS = []; // An array of private key of p2sh-p2wpkh output from our user wallets

let signaturePair = [];

let hardwalletAddress = "17v9bcxrrKF4V2uyRtZR9QHRRcMFvG7pdq";





function multiInputOneOutput() {

    try {
        WIFS.map(WIF => getScriptPbKey(WIF)
            .then(e => console.log(e))
        );
    }
    catch (e) {
        console.error(e.message);
    }

}

multiInputOneOutput();


function getScriptPbKey(WIF) {

    let keypair = bitcoin.ECPair.fromWIF(WIF, NETWORK);
    signaturePair.push(keypair);


    let pubKey = keypair.getPublicKeyBuffer();
    let pubKeyHash = bitcoin.crypto.hash160(pubKey);
    let redeemScript = bitcoin.script.witnessPubKeyHash.output.encode(pubKeyHash);
    let redeemScriptHash = bitcoin.crypto.hash160(redeemScript);
    let scriptPubkey = bitcoin.script.scriptHash.output.encode(redeemScriptHash);

    //add input
    return txb.addInput(txid, outn, null, scriptPubkey);

}

//add output
txb.addOutput(hardwalletAddress, 30000); //first argument is receiving address, the second is the amount we are sending after deducting a mining fee


//signing

function multiSign() {
    signaturePair.map(keypair => txb.sign(0, keypair, redeemScript, null, 35000))
}
//amount is the FULL amount of the unspent output, NOT the amount we are sending

multiSign();

let tx = txb.build();
let txhex = tx.toHex();

console.log(txhex);
