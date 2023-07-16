
import { Get as getAggregate } from 'aleph-sdk-ts/dist/messages/aggregate';


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




export async function aleph_fetch(address : string) {
    
    const res = await getAggregate({
        address  : address,
        APIServer: "https://api2.aleph.im"
    });
    //console.log("requête get : ", res);
    return res;
    
}