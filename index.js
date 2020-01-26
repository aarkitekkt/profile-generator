const inquirer = require("inquirer");
const fs = require('fs');
const axios = require("axios");
const util = require("util");

const appendFileAsync = util.promisify(fs.appendFile);
const readFileAsync = util.promisify(fs.readFile);

const questions = [
    {
        type: "input",
        name: "color",
        message: "What is your favorite color?"
    }, {
        type: "input",
        name: "github",
        message: "What is your GitHub username?"
    }
];

inquirer.prompt(questions)
    .then(function (response) {

        console.log(response.github + "'s favorite color is " + response.color);

        getGithub(response);

    });


function getGithub(response) {

    let userName = response.github;

    console.log("user " + userName + " is being searched for on Github")

    const queryUrl = `https://api.github.com/users/${userName}`;

    console.log(queryUrl);

    axios
        .get(queryUrl)
        .then(function (res) {

            const userData = res.data;

            console.log(userData);

        });
}








function writeToFile(fileName, data) {

}

function init() {
}

init();
