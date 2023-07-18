
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
    try {
        const res = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            pbkdf,
            encoded,
        );
        return { res, iv };     // associer res et iv dans le backend.


    } catch(e) { // VOIR COMMENT GERER ERREUR POTENTIELLE
        console.log("error while ciphering data");
        const res = undefined;
        return { res, iv };
    }


}


//key correspond au website (url ?)
export async function cipherMessage(key : string, title : Array<string>, login : Array<string>, password : Array<string>, pbkdf : CryptoKey) {

    const ckey = await cipherString(key, pbkdf);
    
    const decckey = dec.decode(ckey.res);
    const ckeyiv = ckey.iv;
   
    let ctitleArray = [];
    let cloginArray = [];
    let cpasswordArray = [];
    for(let i=0; i<title.length; i++) {
        ctitleArray.push(await cipherString(title[i], pbkdf));
        cloginArray.push(await cipherString(login[i], pbkdf));
        cpasswordArray.push(await cipherString(password[i], pbkdf));
    }
    

    const content = { a : ckeyiv, b : ctitleArray, c : cloginArray, d : cpasswordArray }
    return { decckey, content };

}



// le content est de la forme { 'a' : ckeyiv, 'b' : mon_titre_chiffre, 'c' : iv_titre, 'd' : mon_login_chiffre, 'e' : iv_login, 'f' : mon_password_chiffre, 'g' : iv_password } et key correspond au website(url ?)
export async function aleph_create(account : Account, key : string, content : object) {

    try{
        const res = await publishAggregate({
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
        return res;

    } catch(e) {
        console.log("erreur pour fetch");
        //res = e;
    }
    //console.log("requête create ou update : ", res);

} 


// Appeler importAccount de accountgeneration.ts pour retrieve account 
export async function create_update_delete(account : Account, key : string, title : Array<string>, login : Array<string>, password : Array<string>, pbkdf : CryptoKey) {
    
    const { decckey, content } = await cipherMessage(key, title, login, password, pbkdf);
    aleph_create(account, decckey, content);

}



  
