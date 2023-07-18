
import { Account } from 'aleph-sdk-ts/dist/accounts/account';
import { Publish as publishAggregate } from 'aleph-sdk-ts/dist/messages/aggregate';
import { ItemType } from 'aleph-sdk-ts/dist/messages/types';



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


    return { res, iv };     // associer res et iv dans le backend.

}


//key correspond au website(url ?)
export async function cipherMessage(key : string, title : string, login : string, password : string, pbkdf : CryptoKey) {

    const ckey = await cipherString(key, pbkdf);
    const decckey = dec.decode(ckey.res);
    const ckeyiv = ckey.iv;

    const ctitle = await cipherString(title, pbkdf);
    const clogin = await cipherString(login, pbkdf);
    const cpassword = await cipherString(password, pbkdf);

    return { decckey, ckeyiv, ctitle, clogin, cpassword };

}



// le content est de la forme { 'a' : ckeyiv, 'b' : mon_titre_chiffre, 'c' : iv_titre, 'd' : mon_login_chiffre, 'e' : iv_login, 'f' : mon_password_chiffre, 'g' : iv_password } et key correspond au website(url ?)
export async function aleph_create(account : Account, key : string, content : object) {
    let res;
    try{
        res = await publishAggregate({
            account: account,
            key: key,
            content: content,


            // DEBUT QUESTIONS
            channel: "TEST", // A HARDCODER CEST QUOI CHANNEL ?
            storageEngine: ItemType.inline, // A HARDCODER CA DOIT ETRE ALEPH_STORAGE OU INLINE ?
            //inlineRequested: true, // car deprecated
            // FIN QUESTIONS


            APIServer: "https://api2.aleph.im"
        });
    } catch(e) {
        console.log("erreur pour fetch");
        //res = e;
    }
    //console.log("requête create ou update : ", res);
    return res;

} 



  
