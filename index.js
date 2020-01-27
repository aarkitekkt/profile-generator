const inquirer = require("inquirer");
const fs = require('fs');
const axios = require("axios");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

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

    })
    .catch(function (err) {
        console.log(err);
    });;

function getGithub(response) {

    let userName = response.github;

    console.log("user " + userName + " is being searched for on Github")

    const queryUrl = `https://api.github.com/users/${userName}`;

    console.log(queryUrl)

    axios
        .get(queryUrl)
        .then(function (res) {

            userData = res.data;

            console.log(userData.name);

            writeFile(userData);

        });
}

function generateHTML(data) {


    return `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Profile</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
        integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">

</head>

<body>
    <div class="d-flex justify-content-center">
        <div class="row">
            <img class="rounded-circle" src="${data.avatar_url}" alt="">
        </div>
        <div class="row">
            <h1>${data.name}</h1>
        </div>


    </div>

</body>

</html>`
}

function generateTextFile(data) {
    const info = {
        name: data.name,
        location: data.location,
        github: data.url,
        profilePic: data.avatar_url,
        repos: data.public_repos,
        followers: data.followers,
        following: data.following,
    }

    return info

}

function writeFile(data) {

    console.log(data.name);

    var fileName = data.name.toLowerCase() + ".html";
    // 
    const html = generateHTML(data);

    // const text = generateTextFile(data);

    writeFileAsync(fileName, html)
        .then(function () {
            console.log("successfully written .html file!")
        });

    // writeFileAsync(fileName, JSON.stringify(text))
    //     .then(function () {
    //         console.log("successfully wrote .txt file!")
    //     });

}

function init() {
}

init();
