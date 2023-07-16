
import { Publish as publishAggregate } from 'aleph-sdk-ts/dist/messages/aggregate';
import { ItemType } from 'aleph-sdk-ts/dist/messages/types';

import { Account } from 'aleph-sdk-ts/dist/accounts/account';

import { NewAccount } from 'aleph-sdk-ts/dist/accounts/ethereum';
export const { account } = NewAccount(); 

const enc = new TextEncoder();
const dec = new TextDecoder("utf-8");


//recuperer pbkdf de la data
export async function cipherString(myString : string, pbkdf : CryptoKey) {
    
    const encoded = enc.encode(myString);

    // iv will be needed for decryption
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const res = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        pbkdf,
        encoded,
    );

    // associer res et iv dans le local storage ou backend ?

    return res;
}


//key correspond au website(url ?)
export async function cipherMessage(key : string, title : string, login : string, password : string, pbkdf : CryptoKey) {

    const ckey = await cipherString(key, pbkdf);
    const decckey = dec.decode(ckey);

    const ctitle = await cipherString(title, pbkdf);
    const clogin = await cipherString(login, pbkdf);
    const cpassword = await cipherString(password, pbkdf);

    return { decckey, ctitle, clogin, cpassword };

}



// le content est de la forme { 'a' : 'mon_titre', 'b' : 'mon_login', 'c' : 'mon_password' } et key correspond au website(url ?)
export async function aleph_create(account : Account, key : string, content : object) {

    const res = await publishAggregate({
        account: account,
        key: key,
        content: content,


        // DEBUT QUESTIONS
        channel: "TEST", // A HARDCODER CEST QUOI CHANNEL ?
        storageEngine: ItemType.storage, // A HARDCODER CA DOIT ETRE ALEPH_STORAGE OU INLINE ?
        inlineRequested: true,
        // FIN QUESTIONS


        APIServer: "https://api2.aleph.im"
    });
    //console.log("requête create ou update : ", res);
    return res;


} 



  
