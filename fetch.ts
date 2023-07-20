
import { Account } from 'aleph-sdk-ts/dist/accounts/account';
import { Get as getAggregate } from 'aleph-sdk-ts/dist/messages/aggregate';


const enc = new TextEncoder();
const dec = new TextDecoder("utf-8");




//recuperer iv et data depuis aleph + recuperer pbkdf de la data en derivant une signature de l'account
export async function decipherData(data : ArrayBuffer, pbkdf : CryptoKey, iv : Uint8Array) {


    try{
        const res = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            pbkdf,
            data,
        );
        const stringData = dec.decode(res);

        const jsonData = JSON.parse(stringData);

        return jsonData;

    } catch(e) {
        console.log("error while deciphering data");
    }

}




// voir comment on fait remonter le cas d'erreur dans l'appli
export async function aleph_fetch(address : string, keys? : Array<string>) {

    try {
        const res = await getAggregate({
            address  : address,
            keys : keys,
            APIServer: "https://api2.aleph.im"
        });
        return res;

    } catch(e) {
        console.log("erreur pour fetch");
        //res = e;
    }
    //console.log("requête get : ", res);
    
}



export async function read(account : Account, pbkdf : CryptoKey) {
    
    const res = await aleph_fetch(account.address);

    const str : string = JSON.stringify(res);
    const json = JSON.parse(str);

    const nbreCreds : number = json.cpt.cpt;

    let myCreds = [];
    for(let i=0; i <= nbreCreds; i++) {
        const cred = await decipherData(json.i.a, pbkdf, json.i.b);
        myCreds.push(cred);
    }

    return myCreds;
}



/*
export async function decipherMessage(res : any, pbkdf : CryptoKey) {
    
    let creds = [];

    for(let i=0; i < res.content.cContent.length; i++) {

        const service = await decipherData(res.content.cContent[i].a.res, pbkdf, res.content.cContent[i].a.iv);
        const title = await decipherData(res.content.cContent[i].b.res, pbkdf, res.content.cContent[i].b.iv);
        const login = await decipherData(res.content.cContent[i].c.res, pbkdf, res.content.cContent[i].c.iv);
        const password = await decipherData(res.content.cContent[i].d.res, pbkdf, res.content.cContent[i].d.iv);

        creds.push({ a : service, b : title, c : login, d : password, id : i }); // id afin d'identifer, depuis le frontend, le cred à modifier ou supprimer

    }

    return creds;

    
}
*/
