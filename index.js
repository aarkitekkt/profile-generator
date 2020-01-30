const inquirer = require("inquirer");
const fs = require('fs-extra');
const axios = require("axios");
const util = require("util");
const puppeteer = require("puppeteer");

// variable containing user information retrieved from GitHub API
const userInfo = {};

askQuestions()
    .then(function (response) {
        return showAnswers(response)
    })
    .then(function (userName) {
        return buildQueryUrl(userName)
    })
    .then(function (queryUrl) {

        // Make GitHub API call and append relevant data to userInfo object.
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

        // Make GitHub API call and append star data to userInfo object.
        const starQueryUrl = `https://api.github.com/users/${userInfo.username}/starred`;

        console.log(starQueryUrl);

        return axios
            .get(starQueryUrl)
            .then(function (res) {

                const starData = res.data;

                userInfo.starCount = starData.length;

                return userInfo
            })
    })
    .then(function (userInfo) {
        return generateHTML(userInfo);
    })
    .then(function (htmlFile) {
        return createPdf(htmlFile);
    })
    .catch(function (err) {
        console.log(err);
    });

// A function to ask user question in command line.
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

// A function to retrieve and save answers in userInfo object.
function showAnswers(data) {
    let userName = data.github;
    let color = data.color;

    console.log(userName + "'s favorite color is " + color);

    userInfo.username = userName;

    userInfo.favoriteColor = color;

    return userName
}

// A function to take given user name and generate url for GitHub API call.
function buildQueryUrl(name) {

    const queryUrl = `https://api.github.com/users/${name}`;

    console.log("searching " + queryUrl);

    return queryUrl;
}

// A function to take data from GitHub API call and add it to profile page html.
function generateHTML(data) {

    console.log(userInfo);

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
    
        <div class="container-fluid">
            <div class="row" style="height: 200px; background-color: ${userInfo.favoriteColor};">
                <div class="col-4">
                    <img class="img-fluid border border-white rounded-circle my-5"
                        src="${userInfo.profilePic}" alt="">
                </div>
                <div class="col-8 mt-5 text-white text-left">
                    <h1 style="font-size: 60px;">${userInfo.name}</h1>
                </div>
            </div>
        </div>
    
        <div style="margin-left: 40%;" class="container mt-5">
    
            <div class="row">
                <h3 class="text-right">${userInfo.location}</h3>
            </div>
            <div class="row">
                <h3>${userInfo.gitHub}</h3>
            </div>
            <div class="row mt-3">
                <ul>
                    <li>Public Repos: ${userInfo.repos}</li>
                    <li>Followers: ${userInfo.followers}</li>
                    <li>Following: ${userInfo.following}</li>
                    <li>Stars: ${userInfo.starCount}</li>
                </ul>
            </div>
        </div>
    
    </body>
    
    </html>`

    console.log("html file generated for " + data.username)

    return htmlFile
}

// A function to generate a .PDF from the generated html and save to local folder.
async function createPdf(code) {

    try {

        var fileName = userInfo.username + ".pdf";
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(code);
        await page.emulateMedia("screen");
        await page.pdf({
            path: fileName,
            width: "1200 px",
            height: "500 px",
            printBackground: true
        });

        console.log("pdf made!");
        await browser.close();
        process.exit;
    } catch (e) {
        console.log("pdf error", e);
    }
};

function init() {
}

init();
