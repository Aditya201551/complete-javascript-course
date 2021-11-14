// let age = 50;

// let ob = {
//   age: 10,
//   f: function () {
//     let self=this;
//     console.log(this);
//     console.log(this.age);
//     const ff=()=>
//     {
//         console.log(age);
//     }
//     ff();
//   },
// };
// ob.f();

// const add = function () {
//   console.log(arguments);
//   let sum = 0;
//   for (let i in arguments) {
//       console.log(i+" "+arguments[i]);
//     sum += arguments[i];
//     // console.log(typeof i);
//   }
//   return sum;

// };

// console.log(add(10, 20, 30, 45, 8));
let a = {
  name: 'tom',
  age: 50,
  hobbies: ['play'],
};

let b = Object.assign({}, a);
// b.hobbies.push('code');
b.hobbies = ['code'];
