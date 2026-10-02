//const page = {
  //click: async (selector: string) => {
   // console.log(`clicking ${selector}`);
  //},
//};

///async function runTest() {
      //const promise = new Promise(resolve => setTimeout(() => resolve(42), 3000));
      //console.log(promise);
    //  const promise = fetch("https://example.com");

//console.log(promise);

     /// await promise;
     // console.log(promise);
  //console.log('1: start');
 // const p = page.click('#btn');
  //console.log('2: after click() call');
 // await p;
  //console.log('4: click settled, resumed');
//}
//runTest();
//console.log('3: after runTest() returns');

import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({
    headless: false
  });

  const page = await browser.newPage();

  console.log("1. Opening website...");

  const promise = page.goto("https://example.com");

  console.log("2. Navigation Promise:", promise);

  await promise;

 


  console.log("3. Navigation finished:", promise);

  console.log("4. Page title:", await page.title());


  await browser.close();
})();


/*
async function runTest() {
  console.log("1. Opening website...");

  const promise = page.goto("https://exampleeeeeee.com");

  console.log("2. Navigation Promise:", promise);

  try {
    const response = await promise;

    console.log("3. Navigation succeeded:", response);
  } catch (error) {
    console.log("3. Navigation failed!");
    console.log("Error:", error);
  }

  console.log("4. Test continues...");
}

runTest();*/