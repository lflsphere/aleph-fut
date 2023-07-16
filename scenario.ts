import { account } from './create';
import { aleph_create } from './create';
import { Buffer } from 'buffer';

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

aleph_create(account, cle, { 'a' : 'first', 'b' : c, 'c' : v});
//aleph_create(account, "psg", {"kimpembe" : "dc", "verrati" : "mc"} );

//const res = aleph_get(account.address);
//console.log(res);