
import { Get as getAggregate } from 'aleph-sdk-ts/dist/messages/aggregate';
import { AggregateMessage } from 'aleph-sdk-ts/dist/messages/types';


const enc = new TextEncoder();
const dec = new TextDecoder("utf-8");




//recuperer iv et myString + recuperer pbkdf de la data
export async function decipherData(data : ArrayBuffer, pbkdf : CryptoKey, iv : Uint8Array) {

    const res = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        pbkdf,
        data,
    );

    const stringData = dec.decode(res);

    return stringData;
}


export async function decipherKey(key : string, pbkdf : CryptoKey, iv : Uint8Array) {

    const encoded = enc.encode(key);

    const stringKey = await decipherData(encoded, pbkdf, iv);

    return stringKey;
    
}



// voir comment on fait remonter le cas d'erreur dans l'appli
export async function aleph_fetch(address : string) {
    let res;
    try {
        res = await getAggregate({
            address  : address,
            APIServer: "https://api2.aleph.im"
        });
    } catch(e) {
        console.log("erreur pour fetch");
        //res = e;
    }
    //console.log("requête get : ", res);
    return res;
    
}
