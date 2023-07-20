
import { Account } from 'aleph-sdk-ts/dist/accounts/account';
import { Publish as publishAggregate } from 'aleph-sdk-ts/dist/messages/aggregate';
import { ItemType } from 'aleph-sdk-ts/dist/messages/types';
import { aleph_fetch } from './fetch';




const enc = new TextEncoder();
const dec = new TextDecoder("utf-8");



//recuperer pbkdf de la data
export async function cipherData(data : Object, pbkdf : CryptoKey) {
    
    
    try {

        const encoded = enc.encode(data.toString());

        // iv will be needed for decryption
        const iv = window.crypto.getRandomValues(new Uint8Array(12));

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



// le content est de la forme { 'a' : ckeyiv, 'b' : mon_titre_chiffre, 'c' : iv_titre, 'd' : mon_login_chiffre, 'e' : iv_login, 'f' : mon_password_chiffre, 'g' : iv_password } et key correspond au website(url ?)
export async function aleph_create(account : Account, key : string, content : Object) {

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
export async function create(account : Account, content : { a : number, b : string, c : string, d : string, e : string}, pbkdf : CryptoKey) {
    
    const prevKey = await aleph_fetch(account.address, ['cpt']);
    const str : string = JSON.stringify(prevKey);
    const json = JSON.parse(str);
    const newKey : number = json.cpt.cpt + 1;


    const { res, iv } = await cipherData(content, pbkdf);
    aleph_create(account, `${newKey}`, { a : res, b : iv});
    aleph_create(account, 'cpt', {newKey});



}


export async function update_delete(account : Account, content : { a : number, b : string, c : string, d : string, e : string}, pbkdf : CryptoKey) {
    
    const { res, iv } = await cipherData(content, pbkdf);
    aleph_create(account, `${content.a}`, { a : res, b : iv});


}



//recuperer pbkdf de la data
/*
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

        
        const res = undefined;
        return { res, iv };
    }


}
*/



//key correspond au website (url ?)
/*
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
*/






  
