'use strict';

const poll = {
  question: 'What is your favorite programming language?',
  options: ['0:JavaScript', '1:Python', '2:Rust', '3:C++'],
  answers: new Array(4).fill(0),
};

function registerAnswer() {
  console.log(this.question);
  for (let i of this.options) {
    let [option, answer] = i.split(':');
    console.log(`${option}: ${answer}`);
  }
  console.log('(Write option number)');
  let inp = Number(prompt('Enter your option'));
  if (inp >= 0 && inp <= 3) this.answers[inp]++;
  else alert('Invalid Input');
  console.log(this);
}

function displayResult(type = 'array') {
  type = type.toLowerCase();
  if (type == 'string')
    console.log(`Results are ${this.answers}`)
  else console.log(this.answers);
}
