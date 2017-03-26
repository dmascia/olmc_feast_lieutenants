"use strict";

const db = require('./app/models');
const faker = require('faker');


db.Lifters.findAll( {
  where: { UserId: 1 },
  limit: 39
})
  .then( result => {

    const blah = result.map( lifter => {

      return {
        firstname: lifter.dataValues.firstname,
        lastname: lifter.dataValues.lastname,
        paymentToken: "0055fer",
        payerID: "fio4fjr4r",
        paymentID: "505t55",
        intent: "sale",
        UserId: 1
      }

    })

    db.Payments.bulkCreate(blah)
      .then(console.log)
      .catch(console.error);

  })


//for(let i = 0; i < 40; i++) {
//  lifters.push({
//    firstname:  faker.name.firstName(),
//    lastname: faker.name.lastName(),
//    dob: "1917-03-09",
//    email: faker.internet.email(),
//    address: faker.address.streetAddress(),
//    city: faker.address.city(),
//    state: faker.address.state(),
//    zip: faker.address.zipCode(),
//    phone: faker.phone.phoneNumber(),
//    tshirt_size: 'XL',
//    UserId: ,
//    isRemoved: 0
//  });
//}

//db.Payments.bulkCreate(lifters)
//  .then(console.log)
//  .catch(console.error);
