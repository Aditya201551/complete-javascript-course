'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let activeAccount;
let time = 10;
let timer = setInterval(() => {
  let minute = String(Math.floor(time / 60)).padStart(2, '0');
  let second = String(time - minute * 60).padStart(2, '0');
  labelTimer.textContent = `${minute}:${second}`;
  if (time <= 0) {
    logout();
    clearInterval(timer);
  }
  time -= 1;
}, 1000);

function timerReset() {
  time = 10;
}

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

function init() {
  containerApp.style.display = 'none';
  accounts.forEach(element => {
    let shortForm = '';
    let totalAmount = 0;
    element.username = element.owner.split(' ');
    for (let i of element.username) shortForm += i[0];
    element.username = shortForm.toLowerCase();
    element.movements;
    element.movements.forEach(i => (totalAmount += i));
    element.balance = totalAmount;
  });
}

btnLogin.addEventListener('click', () => {
  console.log('login clicked');
  let username = inputLoginUsername.value;
  let pin = inputLoginPin.value;

  accounts.forEach(i => {
    if (i.username == username && i.pin == pin) {
      activeAccount = i;
      displayInterface(i);
    }
  });
  inputLoginPin.value = '';
  inputLoginUsername.value = '';
});

function displayInterface(obj) {
  containerApp.style.display = '';
  setTimeout(() => {
    containerApp.style.opacity = 1;
  }, 0);
  labelWelcome.textContent = `Good Afternoon, ${obj.owner.slice(
    0,
    obj.owner.indexOf(' ')
  )}!`;
  let date = new Date();
  labelDate.textContent = `${new Date().toLocaleDateString()}, ${date.getHours()}:${date.getMinutes()}`;
  labelBalance.textContent =
    Intl.NumberFormat(navigator.language).format(obj.balance) + '\t€';
  displayMovements(obj.movements);
  displayStats(obj.movements, obj.interestRate);
}
function displayMovements(movements, orderedDate = false) {
  containerMovements.innerHTML = '';
  movements.forEach((i, j) => {
    let type = i < 0 ? 'withdrawal' : 'deposit';
    let html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      j + 1
    } ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${i}€</div>
        </div>
    `;
    if (!orderedDate)
      containerMovements.innerHTML = html + containerMovements.innerHTML;
    else containerMovements.innerHTML += html;
  });
  timerReset();
}
function displayStats(movements, interestRate) {
  let sumIn = 0,
    sumOut = 0,
    interest = 0;
  movements.forEach(i => {
    if (i < 0) sumOut += Math.abs(i);
    else sumIn += i;
  });
  interest = sumIn * interestRate;

  labelSumIn.textContent = sumIn;
  labelSumOut.textContent = sumOut;
  labelSumInterest.textContent = interest;
}
function logout() {
  labelWelcome.textContent = 'Log in to get started';
  containerApp.style.opacity = 0;
  setTimeout(() => {
    containerApp.style.display = 'none';
  }, 500);
}

btnTransfer.addEventListener('click', () => {
  let to = inputTransferTo.value;
  let amt = parseInt(inputTransferAmount.value);
  console.log(to + ' ' + amt);
  for (let i of accounts) {
    if (i.username == to && i.username != activeAccount.username) {
      if (amt <= activeAccount.balance) {
        activeAccount.balance -= amt;
        activeAccount.movements.push(amt * -1);
        i.balance += amt;
        i.movements.push(amt);
      }
    }
  }
  inputTransferTo.value = '';
  inputTransferAmount.value = '';
  displayInterface(activeAccount);
});

btnLoan.addEventListener('click', () => {
  let amt = parseInt(inputLoanAmount.value);
  setTimeout(() => {
    activeAccount.balance += amt;
    activeAccount.movements.push(amt);
    displayInterface(activeAccount);
  }, 2000);
  console.log('Processing Loan....please wait');
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', () => {
  let user = inputCloseUsername.value;
  let pin = inputClosePin.value;
  if (user == activeAccount.username && pin == activeAccount.pin) {
    for (let i = 0; i < accounts.length; i++) {
      if (
        accounts[i].username == activeAccount.username &&
        accounts[i].pin == activeAccount.pin
      ) {
        logout();
        accounts.splice(i, 1);
        break;
      }
    }
  } else console.log('Incorrect Credentials');

  inputClosePin.value = '';
  inputCloseUsername.value = '';
});
let checkSort = false;
btnSort.addEventListener('click', () => {
  if (checkSort) {
    displayMovements(activeAccount.movements, true);
    checkSort = false;
  } else {
    displayMovements(activeAccount.movements, false);
    checkSort = true;
  }
});

init();
