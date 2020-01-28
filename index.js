const inquirer = require("inquirer");
const fs = require('fs');
const axios = require("axios");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

const userInfo = [];

askQuestions()
    .then(function (response) {
        return showAnswers(response)
    })
    .then(function (userName) {
        return buildQueryUrl(userName)
    })
    .then(function (queryUrl) {
        return axios
            .get(queryUrl)
            .then(function (res) {

                const userData = res.data;

                console.log("API call made for " + userData.login)

                userInfo.name = userData.name;
                userInfo.location = userData.location;
                userInfo.followers = userData.followers;
                userInfo.following = userData.following;
                userInfo.gitHub = userData.html_url;
                userInfo.profilePic = userData.avatar_url;
                userInfo.repos = userData.public_repos;

                return userInfo

            })


    })
    .then(function (userInfo) {

        const starQueryUrl = `https://api.github.com/users/${userInfo.username}/starred`;

        console.log(starQueryUrl);

        return axios
            .get(starQueryUrl)
            .then(function (res) {

                const starData = res.data;

                userInfo.starCount = starData.length + " stars";

                console.log(userInfo)

                return userInfo
            })
    })
    .then(function (userInfo) {
        return generateHTML(userInfo);
    })
    .then(function (htmlFile) {
        writeFile(htmlFile);
    })
    .catch(function (err) {
        console.log(err);
    });

function askQuestions() {

    return inquirer.prompt([
        {
            type: "input",
            name: "color",
            message: "What is your favorite color?"
        }, {
            type: "input",
            name: "github",
            message: "What is your GitHub username?"
        }
    ]);
}

function showAnswers(data) {
    let userName = data.github;
    let color = data.color;

    console.log(userName + "'s favorite color is " + color);

    userInfo.username = userName;

    userInfo.favoriteColor = color;

    return userName
}

function buildQueryUrl(name) {

    const queryUrl = `https://api.github.com/users/${name}`;

    console.log("searching " + queryUrl);

    return queryUrl;
}

function generateHTML(data) {

    var htmlFile = `
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

    <!-- Profile Image and Name -->
    <div class="d-flex">
        <div class="row" style="background-color: ${data.favoriteColor};">
            <div class="col-6">
                <img class="img-fluid rounded-circle my-5" src="${data.profilePic}"
                    alt="">
            </div>
            <div class="col-6 text-white text-justify-right">
                <h3>${data.name}n</h3>
                <h5>Location: ${data.location} </h5>
                <h5>Github: ${data.gitHub}</h5>
                <ul>
                    <li>Public Repos: ${data.repos}</li>
                    <li>Followers: ${data.followers}</li>
                    <li>Following: ${data.following}</li>
                    <li>Stars: ${data.starCount}</li>
                </ul>
            </div>
        </div>
    </div>
</body>

</html>`

    console.log("html file generated for " + data.username)

    return htmlFile
}

function writeFile(data) {

    var fileName = "resume.html";

    writeFileAsync(fileName, data)
        .then(function () {
            console.log("successfully written .html file!")
        });
}

function init() {
}

init();
