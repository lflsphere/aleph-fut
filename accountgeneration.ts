
import { ImportAccountFromMnemonic, NewAccount, ETHAccount } from 'aleph-sdk-ts/dist/accounts/ethereum';
import { MessageType } from 'aleph-sdk-ts/dist/messages/types';
import { ItemType } from 'aleph-sdk-ts/dist/messages/types/base';
import { Chain } from 'aleph-sdk-ts/dist/messages/types/base';

//import { Buffer } from 'buffer';

const enc = new TextEncoder();
const dec = new TextDecoder("utf-8");


export async function generateKey(password: string) {

    const digest : ArrayBuffer = await window.crypto.subtle.digest("SHA-256", enc.encode(password));
    const gcm : CryptoKey = await window.crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]);
    const pbkdf : CryptoKey = await window.crypto.subtle.deriveKey("PBKDF2", gcm, "AES-GCM", false, ["encrypt", "decrypt"]);

    return pbkdf;
    
}




export async function protectAccount(pbkdf : CryptoKey, mnemonic : ArrayBuffer) {
    
    // iv will be needed for decryption
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); 

    const cMnemonic = window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        pbkdf,
        mnemonic,
        ); 
    //stocker iv + mnemonic
    const cipheredLoaker = {
        cmnemo : cMnemonic,
        mnemoiv : iv,
    };

    browser.storage.local.set({ "cLoaker" : cipheredLoaker});


    //return cpK ???

}



//recuperer pbkdf de generateKey(password)
export async function generateNewAccount(pbkdf : CryptoKey) {

    const { account, mnemonic } = NewAccount(); 

    const encMnemonic = enc.encode(mnemonic);
    protectAccount(pbkdf, encMnemonic);

    return account; // permet de directement interagir avec aleph dès la génération du compte

}




//recuperer iv et cpk du local storage + recuperer pbkdf de generateKey(password)
export async function changePassword(pbkdf : CryptoKey, newPassword : string) {

    const cipheredLoaker = browser.storage.local.get("cLoaker");
    const iv = cipheredLoaker.mnemoiv;
    const cMnemonic = cipheredLoaker.mnemo;

    const pbkdfNew : CryptoKey = await generateKey(newPassword);

    const mnemonic : ArrayBuffer = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv }, pbkdf, cMnemonic);

    protectAccount(pbkdfNew, mnemonic);


    
}




//recuperer iv et cpk du local storage + recuperer pbkdf de generateKey(password)
export async function importAccount(pbkdf : CryptoKey) {

    const cipheredLoaker = browser.storage.local.get("cLoaker");
    const iv = cipheredLoaker.mnemoiv;
    const cMnemonic = cipheredLoaker.mnemo;

    const mnemonic : ArrayBuffer = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv }, pbkdf, cMnemonic);
    const mnemonicString : string = dec.decode(mnemonic);

    const ETHAccount = ImportAccountFromMnemonic(mnemonicString);

    return ETHAccount;

}




export async function generateDataKey(account : ETHAccount) {
    

    const hash = await window.crypto.subtle.digest("SHA-256", enc.encode("item"));
    const stringHash = dec.decode(hash);

    const signature = await account.Sign({  

        chain: Chain.TEZOS,
        sender: account.address,
        type: MessageType.aggregate,
        channel: "TEST",
        confirmed: true,
        signature: "signature",
        size: 123,
        time: 123,
        item_type: ItemType.inline, //inline ou storage
        item_hash: stringHash,
        content: { address : account.address, time : 123}

    });

    const res = await generateKey(signature);

    return res;

}






