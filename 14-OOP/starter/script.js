// 'use strict';
// function Car(make, speed) {
//   this.make = make;
//   this.speed = speed;
// }

// Car.prototype.accelerate = function () {
//   this.speed += 10;
//   console.log(`${this.make} is going at ${this.speed} km/h`);
// };

// Car.prototype.break = function () {
//   this.speed -= 5;
//   console.log(`${this.make} is going at ${this.speed}km/h`);
// };

// function EV(make, speed, charge) {
//   Car.call(this, make, speed);
//   this.charge = charge;
// }

// EV.prototype = Object.create(Car.prototype);
// EV.prototype.accelerate = function () {
//   this.speed += 10;
//   this.charge--;
//   console.log(
//     `${this.make} is going at ${this.speed} km/h with charge ${this.charge}%`
//   );
// };

// EV.prototype.chargeBattery = function (charge) {
//   if (charge > 100) {
//     console.log(`${this.make} can charge only upto 100%`);
//   } else if (charge > this.charge) {
//     setTimeout(() => {
//       this.charge = charge;
//       console.log(`Battery of ${this.make} has been charged upto ${charge}%`);
//     }, 1500);
//   } else {
//     console.log(`Your ${this.make} is already been charged to ${charge}%`);
//   }
// };

// let tesla = new EV('tesla', 120, 23);
// let bmw = new Car('Car', 120);

// tesla.accelerate();
// bmw.accelerate();
// tesla.accelerate();
// bmw.break();
// tesla.break();
// tesla.chargeBattery(120);
// tesla.chargeBattery(90);

class Car {
  constructor(make, speed) {
    this.make = make;
    this.speed = speed;
  }

  accelerate() {
    this.speed += 10;
    console.log(`${this.make} is going at ${this.speed} km/h`);
    return this;
  }

  break() {
    this.speed -= 5;
    console.log(`${this.make} is going at ${this.speed}km/h`);
    return this;
  }
}

class EV extends Car {
  #charge;
  constructor(make, speed, charge) {
    super(make, speed);
    this.#charge = charge;
  }

  getcharge() {
    return this.#charge;
  }

  accelerate() {
    this.speed += 10;
    this.#charge--;
    console.log(
      `${this.make} is going at ${this.speed} km/h with charge ${this.#charge}%`
    );
    return this;
  }

  chargeBattery(upto) {
    if (upto > 100) console.log(`${this.make} can charge only upto 100%`);
    else if (upto < this.charge)
      console.log(`Your ${this.make} is already been charged to ${upto}%`);
    else {
      setTimeout(() => {
        this.#charge = upto;
        console.log(`Battery of ${this.make} has been charged upto ${upto}%`);
      }, 1500);
    }
    return this;
  }
}
let tesla = new EV('tesla', 120, 23);
let bmw = new Car('BMW', 120);

tesla.accelerate();
bmw.accelerate();
tesla.accelerate();
bmw.break();
tesla.break();
tesla.chargeBattery(120);
// tesla.chargeBattery(90);
