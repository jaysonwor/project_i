# Project I
The purpose of this application is to showcase how to manage videos from a PWA device and upload to the cloud for further analysis

## The BIG Picture
The following depicts the high-level application concept
![Alt text](src/assets/concept.png "concept")
- PWA Device: a device that the client (Project_I) application is loaded on (refer to local installation for details)
- *Screens: these are located under src/app/pages, and define the screens available to the application user
- API Server: this is hosted in AWS, managed in a separate (Project_I_API) project, and protected by Cognito (AWS managed identity provider)
- AWS: server-side services available to the client application

## Local Installation
### Pre-requisites
- Ionic: https://ionicframework.com/
- Angular: https://angular.io/
- NodeJS: https://nodejs.org/en/

### Deployment