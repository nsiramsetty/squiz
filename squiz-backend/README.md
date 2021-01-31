# Search and Filtering
> App Engine for Search and Filtering.

![Node.js CI](https://github.com/Insight-Timer/app-engine-search-and-filtering/workflows/Node.js%20CI/badge.svg)

![Alt text](./coverage/badge-branches.svg)
![Alt text](./coverage/badge-functions.svg)
![Alt text](./coverage/badge-lines.svg)
![Alt text](./coverage/badge-statements.svg)

  * [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Directory Structure](#directory-structure)
  * [Customization](#Customization)
  * [Installation Steps](#installation-steps)
  * [Build Application](#build-application)
  * [Start Application in App Engine](#start-application-in-app-engine)
  * [Start Application Locally](#start-application-locally)
  * [Testing](#testing)
  * [Linting](#linting)
  * [Deployment](#deployment)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 
See deployment for notes on how to deploy the project on a live system.

## Prerequisites

```
Google Cloud CLI
Firebase Tools
Node JS
NPM
Docker
```
## Directory Structure

```
.env.sample         // Sample .env file to create the actual .env file
.gcloudignore       // List of files or directories to ignore while deploying in App Engine
.git                // Hidden directory used by Git
.github             // Workflows configured in Git
.gitignore          // List of files ignored in commit
.cloudbuild         // Cloud Build Actions
.vscode             // IDE Settings 
Dockerfile          // Instructions to build docker container
README.md           // Instruction README
app.yaml            // Deployment configuration file
cloudbuild.yaml     // Cloud build configuration file
deploy.sh           // Script to deploy manually.
jest.config.js      // Testcases configuration
nodemon.json        // Hot Reload Configuration
node_modules        // Node Modules
package-lock.json   // Dependencies
package.json        // Dependencies
src                 // Application root
tests               // Tests root
coverage        // Coverage Reports
tsconfig.json       // TSLint Settings
.eslintrc.js        // ESLint Settings
```

## Customization

Please edit package.json to change the project information like title, version, authors, github url etc.

```
    "name": "insight-timer-app-engine-template",
    "version": "1.0.0",
    "description": "Insight Timer App Engine Template",
    "repository": {
        "type": "git",
        "url": "git+https://github.com/Insight-Timer/AppEngine-HelloWorld-BestPractices.git"
    },
    "keywords": [
        "template",
        "app engine",
        "airbnb",
        "insight timer",
        "js",
        "javascript",
        "typescript",
        "node",
        "express"
    ],
    "author": "Insight Timer",
    "bugs": {
        "url": "https://github.com/Insight-Timer/AppEngine-HelloWorld-BestPractices/issues"
    },
    "homepage": "https://github.com/Insight-Timer/AppEngine-HelloWorld-BestPractices#readme"
```
## Installation Steps
```
npm ci
```

For easy access, please install the below npm packages globally.

```
npm install -g nodemon tslint typescript jest jest-coverage-badges
```

## Build Application

```
npm run build => npm run clean; npm run compile 
```

## Start Application in App Engine

```
npm run start => node lib/app.js => Will be used by App Engine 
```

## Start Application Locally

```
npm run dev => npm run build; npm run start
npm run dev:watch => nodemon ( You can use nodemon directly, Please see nodemon.js for the watcher settings)
```

## Testing

* Below steps will guide you on how to run the test cases defined in tests directory. 
* This will generate coverage reports under coverage directory. Please refer to lcov-report/index.html for detailed analysis of each module.
* This will also generate test coverage badges and json files with summary.
* Please make sure contents are lcov-report are ignored in .gitignore and let the json and svg files to be pushed to remote so that gthub repository will have svg files to display the current coverage badges.

```
npm run test => jest; jest-coverage-badges ( You can use jest directly, Please see jest.config.js for the settings)
```
```$xslt
jest = > To Execute Only Testcases and generate the coverage reports in ./coverage/ directory.
```
```$xslt
jest-coverage-badges => To generate badges in ./coverage/ directory
```
## Linting

```
npm run lint => List all the issues
npm run lit:fix => Fix the issues which linter can automatically fix. Please check tslint.json, tsconfig.json for settings
```
## Deployment

```$xslt
sh deploy.sh [demo|preprod|prod] [build_no] => If you are using GCR Image
gcloud app deploy --project [projectId]
```
