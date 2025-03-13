# My-Contacts

CSC 308/309 - LeContacts by William Last, Colin Bruins, Diego Nieves, Jeffrey Cheung, Peter Chinh

[![Build and deploy Node.js app to Azure Web App - lecontacts](https://github.com/peterchinh/my-contacts/actions/workflows/main_lecontacts.yml/badge.svg)](https://github.com/peterchinh/my-contacts/actions/workflows/main_lecontacts.yml)
[![Azure Static Web Apps CI/CD](https://github.com/peterchinh/my-contacts/actions/workflows/azure-static-web-apps-blue-sand-05b2e891e.yml/badge.svg)](https://github.com/peterchinh/my-contacts/actions/workflows/azure-static-web-apps-blue-sand-05b2e891e.yml)
[![Node.js CI](https://github.com/peterchinh/my-contacts/actions/workflows/ci-testing.yml/badge.svg)](https://github.com/peterchinh/my-contacts/actions/workflows/ci-testing.yml)

## Links

-   [Production](https://blue-sand-05b2e891e.4.azurestaticapps.net/)
-   [1st Figma Prototype](https://www.figma.com/proto/CayfsuohC3qHYzCc9tb31n/Untitled?node-id=50-36&node-type=canvas&t=AjCr8W0f4a6Cwqp2-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=50%3A36&show-proto-sidebar=1)
-   [2nd Figma Prototype](https://www.figma.com/design/66tjCFUn7XCtA4nlQL2exz/New-Contacts-Page?node-id=0-1&t=5DCrkdIxQSnKZdrb-1)
-   [Product/Tech Spec](https://docs.google.com/document/d/1YyBJFXjlZsVTPF59bxI-Ql8gUD6_8N4YwTdhKBvHRqA/edit?usp=sharing)
-   [Final Presentation](https://docs.google.com/presentation/d/14xgVWtHq6PdL0rPft_zNXRgDijMIUDbUJsED5gj9-yU/edit?usp=sharing)

## Setup

1. Prerequisites: Make sure npm, Node.js, and Git are installed
2. Clone the project using "git clone https://github.com/peterchinh/my-contacts"
3. Run "npm install"
4. "cd backend" and create a .env file
5. While still in the backend, run "npm run dev" to load the backend locally
6. "cd ../" and run "npm start" to load the frontend

## Making Changes

1. git pull
2. git checkout -b <name_of_branch>
3. change code
4. npm run lint

## Committing

1. git add .
2. git commit -m "Action: Desc"
3. git push -u origin <name_of_branch>

## PRS

1. Pull Request tab on github
2. Find pr, fill out template
3. Screenshot of work if applicable
4. Link pr to corresponding issue
5. request reviewer to check code
6. Merge code if approved

## Style Guides

-   Before Committing:
    -   Run "npm run format"
    -   Run "npm run lint"

## Testing/Coverage Report

-   Unit/Integration Tests
    -   "cd backend"
    -   Run "npm install supertest"
    -   Run "npm run test"

![image](https://github.com/user-attachments/assets/098c0db5-7975-446c-a1ed-da665005275f)

-   Acceptance Tests
    -   Run "npm install cypress"
    -   Run "npx cypress open" or "npx cypress run"
    -   Backend needs to be running, or else one of the tests will fail.

![image](https://github.com/user-attachments/assets/36c1629a-fe2a-4d22-bada-ece219df8863)
