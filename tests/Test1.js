"use strict";
/*let count  = 2;
count = 4;
console.log(count + 1);*/
const testName = " user can sign in "; // annotation 
const timeOut = 30;
const shouldretry = true;
let responseBody = '{ status: "ok"}';
if (typeof responseBody === 'string') {
    console.log(responseBody.toUpperCase());
}
