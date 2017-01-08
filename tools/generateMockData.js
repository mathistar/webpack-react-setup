/* This script generates mock data for local development.
   This way you don't have to point to an actual API,
   but you can enjoy realistic, but randomized data,
   and rapid page loads due to local, static data.
 */

/* eslint-disable no-console */
import jsf from 'json-schema-faker';
import {schema} from './mockDataSchema';
import fs from 'fs';
import chalk from 'chalk';

const value = jsf(schema);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


let resultSet = { crsdata: []};
let partyDuplication = [];

Object.keys(value).forEach( (key, pos) => {
  resultSet.crsheader = resultSet.crsheader || [];
  resultSet.crsheader.push(key);
  const values = value[key];
  const randMax = Math.ceil(values.length/2);
  if ( key == 'partyId' ) {
    values.forEach((v,i) => partyDuplication.push(getRandomInt(0,randMax)));
  }

  values.forEach((v,i) => {
    resultSet.crsdata[i]= resultSet.crsdata[i] || [];
    if ( key == 'partyId' || key == 'partyName') {
      resultSet.crsdata[i].push(values[partyDuplication[i]]);
    } else if ( key == 'dateUpdated' ) {
      resultSet.crsdata[i].push(new Date(v).toISOString().substr(0,10));
    } else {
      resultSet.crsdata[i].push(v);
    }

  });
});


const json = JSON.stringify(resultSet,null,2);

fs.writeFile("./src/api/db.json", json, function (err) {
  if (err) {
    return console.log(chalk.red(err));
  } else {
    console.log(chalk.green("Mock data generated."));
  }
});

// http://localhost:3001/crsdata?_page=3&_limit=20
// http://localhost:3001/crsheader
