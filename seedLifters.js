"use strict";

const db = require('./app/models');
const faker = require('faker');

const lifters = [];

for(let i = 0; i < 50; i++) {
  lifters.push({
    firstname:  faker.name.firstName(),
    lastname: faker.name.lastName(),
    age: 44,
    email: faker.internet.email(),
    address: faker.address.streetAddress(),
    city: faker.address.city(),
    state: faker.address.state(),
    zip: faker.address.zipCode(),
    phone: faker.phone.phoneNumber(),
    tshirt_size: 'XL',
    UserId: 6
  });
}

db.Lifters.bulkCreate(lifters)
  .then(console.log)
  .catch(console.error);
