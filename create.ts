
import { Account } from 'aleph-sdk-ts/dist/accounts/account';
import { Publish as publishAggregate } from 'aleph-sdk-ts/dist/messages/aggregate';
import { ItemType } from 'aleph-sdk-ts/dist/messages/types';
import { aleph_fetch } from './fetch';



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

        throw new Error('couldnt cipher one of the parameters');

        /*
        const res = undefined;
        return { res, iv };*/
    }


}




//key correspond au website (url ?)
export async function cipherMessage(content : { a : string, b : string, c : string, d : string}, pbkdf : CryptoKey) {
    if(typeof pbkdf === undefined){
        throw new Error('couldnt generate a CryptoKey for ciphering data');

    }
    
    let cContent = [];
    
    const cservice = await cipherString(content.a, pbkdf);
    const ctitle = await cipherString(content.b, pbkdf);
    const clogin = await cipherString(content.c, pbkdf);
    const cpassword = await cipherString(content.d, pbkdf);
    cContent.push({ a : cservice, b : ctitle, c : clogin, d : cpassword });

    
    
    return { cContent };

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
export async function create(account : Account, content : { b : string, c : string, d : string, e : string}, pbkdf : CryptoKey) {
    
    const res = await aleph_fetch(account.address);

    const str : string = JSON.stringify(res);
    const json = JSON.parse(str);

    //const { cContent } = await cipherMessage(content, pbkdf);
    //aleph_create(account, 'content', cContent);

}


export async function update_delete(account : Account, content : { a : string, b : string, c : string, d : string}, pbkdf : CryptoKey) {
    
}




//key correspond au website (url ?)
/*
export async function cipherMessage(key : string, title : Array<string>, login : Array<string>, password : Array<string>, pbkdf : CryptoKey) {

    const ckey = await cipherString(key, pbkdf);
    
    const decckey = dec.decode(ckey.res);
    const ckeyiv = ckey.iv;
   
    let ctitleArray = [];
    let cloginArray = [];
    let cpasswordArray = [];
    for(let i=0; i<title.length; i++) {
        const ctitle = await cipherString(title[i], pbkdf);
        const clogin = await cipherString(login[i], pbkdf);
        ctitleArray.push(await cipherString(title[i], pbkdf));
        cloginArray.push(await cipherString(login[i], pbkdf));
        cpasswordArray.push(await cipherString(password[i], pbkdf));
    }
    

    const content = { a : ckeyiv, b : ctitleArray, c : cloginArray, d : cpasswordArray }
    return { decckey, content };

}*/



  
