var inquirer = require("inquirer");
var fs = require('fs');

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

promptUser().then(function (response) {
    console.log(response.github + "'s favorite color is " + response.color)
});

function promptUser() {
    return inquirer.prompt(questions);
}


function writeToFile(fileName, data) {

}

function init() {
}

init();
