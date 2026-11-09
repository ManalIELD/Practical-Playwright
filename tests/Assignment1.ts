let arrayOfBrowsers : string []= ['Safari','chrome','Edge'];

// Method 1 : for loop
for(let i=0;i<arrayOfBrowsers.length;i++){
      if (i==arrayOfBrowsers.length - 1){
        console.log(`Browser ${i+1} is ${arrayOfBrowsers[i]} this is the last browser in this list `);
        //break;
      
}
}

//Method 2 : for of loop
for (const browser of arrayOfBrowsers) {
      if(arrayOfBrowsers.indexOf(browser)===arrayOfBrowsers.length - 1){
        console.log(`Browser ${arrayOfBrowsers.indexOf(browser)+1} is ${browser} this is the last browser in this list `);
        break;
      }     
}
/*
// to solve empty array a global if before loop
if (arrayOfBrowsers.length > 0){
  for(let i=0;i<arrayOfBrowsers.length;i++){
      if (i===arrayOfBrowsers.length - 1){
        console.log(`Browser ${i+1} is ${arrayOfBrowsers[i]} this is the last browser in this list `);
        break;
      
}

// Method 2
}
 for (const browser of arrayOfBrowsers) {
      if(arrayOfBrowsers.indexOf(browser)===arrayOfBrowsers.length - 1){
        console.log(`Browser ${arrayOfBrowsers.indexOf(browser)+1} is ${browser} this is the last browser in this list `);
        break;
      }
      
 
}
}

else{
  console.log("The array is empty");
}*/