'use strict';

// function sum() {
//   console.log(arguments);
//   return(arguments[0]+arguments[1]+arguments[2]);
// }
// let arr = [
//   1,2,3
// ];
// console.log(sum(...arr));


let arr=[1,2,3,...[4,58,9,7]]

let [a, , c, d, ...rest]=[...arr,20,5,8,8,9,4]

console.log(a,c,d,rest)