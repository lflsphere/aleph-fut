import { aleph_create } from './create';
import { aleph_fetch } from './fetch';

import { Buffer } from 'buffer';

import { NewAccount } from 'aleph-sdk-ts/dist/accounts/ethereum';
const { account, mnemonic } = NewAccount(); 

const cle : string = 'fcb';
const key : Buffer = Buffer.from(cle);

const c : string = 'rafinia';
const k : Buffer = Buffer.from(c);

const v : string = 'ad';
const val : Buffer = Buffer.from(v);

/*
const a = await account.encrypt(key);
const b = await account.encrypt(k);
const d = await account.encrypt(val);
*/

async function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

async function scenario() {
    await aleph_create(account, cle, { 'a' : 'first', 'b' : c, 'c' : v});
    await aleph_create(account, "psg", {"kimpembe" : "dc", "verrati" : "mc"} );


    await delay(50); // attendre un délai d'au moins 0.6 secondes pour fetch data
    
    const res = await aleph_fetch(account.address);

    console.log(res);
    /*
    const str : string = JSON.stringify(res);
    const jso = JSON.parse(str);

    console.log(jso.data.data);

    

    console.log(jso);

    console.log(jso.fcb.a);
    */
    //return res; 

}



scenario();