
import { Publish as publishAggregate } from 'aleph-sdk-ts/dist/messages/aggregate';
import { Get as getAggregate } from 'aleph-sdk-ts/dist/messages/aggregate';
import { ItemType } from 'aleph-sdk-ts/dist/messages/types';

import { Account } from 'aleph-sdk-ts/dist/accounts/account';


import { NewAccount } from 'aleph-sdk-ts/dist/accounts/ethereum';

export const { account } = NewAccount(); 



export const aleph_create = async (
    account : Account,
    key : string,
    content : object

) => {
    const res = await publishAggregate({
        account: account,
        key: key,
        content: content,
        channel: "TEST", // A HARDCODER CEST QUOI CHANNEL ?
        storageEngine: ItemType.inline, // A HARDCODER CA DOIT ETRE ALEPH_STORAGE OU INLINE ?
        inlineRequested: true,
        APIServer: "https://api2.aleph.im"
    });
    //console.log("requête create ou update : ", res);
    return res;
} 

export const aleph_get = async (
    address : string

) => {
    
    const res = await getAggregate({
        address  : address,
        APIServer: "https://api2.aleph.im"
    });
    //console.log("requête get : ", res);
    return res;
    
}
  
