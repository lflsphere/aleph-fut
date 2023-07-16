"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var create_1 = require("./create");
var create_2 = require("./create");
var buffer_1 = require("buffer");
var cle = 'fcb';
var key = buffer_1.Buffer.from(cle);
var c = 'rafinia';
var k = buffer_1.Buffer.from(c);
var v = 'ad';
var val = buffer_1.Buffer.from(v);
/*
const a = await account.encrypt(key);
const b = await account.encrypt(k);
const d = await account.encrypt(val);
*/
(0, create_2.aleph_create)(create_1.account, cle, { 'a': 'first', 'b': c, 'c': v });
//aleph_create(account, "psg", {"kimpembe" : "dc", "verrati" : "mc"} );
//const res = aleph_get(account.address);
//console.log(res);
