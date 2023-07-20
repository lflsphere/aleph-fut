import { aleph_create } from './create';
import { aleph_fetch } from './fetch';


import { NewAccount } from 'aleph-sdk-ts/dist/accounts/ethereum';
//import { generateDataKey } from './accountgeneration';


const { account, mnemonic } = NewAccount();
 


async function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

async function scenario() {

    
    //const pbkdf = await generateDataKey(account);

    //const { decCKey, resContent } = await cipherMessage('fcb', [ { a : 'first', b : 'rafinia', c : 'ad' } ], pbkdf);
    
    //const v1 : Uint8Array = new Uint8Array([21, 66, 33, 204, 85, 7, 16, 63, 113, 62, 14, 5]);

    /*
    const content = [{ 
        b : 'first',
        c : 'rafinia',
        d : 'ad'
    },
    {
        b : 'second',
        c : 'dembele',
        d : 'ag'
    }
    ];
    */

    
    await aleph_create(account, 'fcb', { cpt : 42});
    await aleph_create(account, 'cpt', { cpt : 44});

    //await aleph_create(account, "psg", [{"kimpembe" : "dc", "verrati" : "mc"}] );


    await delay(700); // attendre un délai d'au moins 0.6 secondes pour fetch data
    
    //const res = await aleph_fetch(account.address);

    const key = await aleph_fetch(account.address, ['cpt']);

    const str : string = JSON.stringify(key);
    const jso = JSON.parse(str);


    console.log(jso);
    console.log(jso.cpt.cpt);
    console.log(typeof jso.cpt.cpt);

}



scenario();