import { Injectable } from '@angular/core';
import * as AWSCognito from "amazon-cognito-identity-js";
import { environment } from '../../environments/environment';

/**
 * Cognito service class
 * Responsible for managing interaction between the client and backend cognito services
 */
@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  constructor() { }

  /**
   * User creation function
   * @param email 
   * @param password 
   * @returns Promise<resolve, reject>
   */
  signUp(email, password) {
    return new Promise((resolve, reject) => {
      const userPool = new AWSCognito.CognitoUserPool(environment.cognito);

      let userAttribute = [];
      userAttribute.push(
        new AWSCognito.CognitoUserAttribute({ Name: "email", Value: email })
      );

      userPool.signUp(email, password, userAttribute, null, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Session logout function
   */
  async logOut() {
    const userPool = new AWSCognito.CognitoUserPool(environment.cognito);
    userPool.getCurrentUser().signOut();
  }

  /**
   * Confirm user function
   * @param verificationCode 
   * @param email 
   * @returns Promise<resolve, reject>
   */
  confirmUser(verificationCode, email) {
    return new Promise((resolve, reject) => {
      const userPool = new AWSCognito.CognitoUserPool(environment.cognito);

      const cognitoUser = new AWSCognito.CognitoUser({
        Username: email,
        Pool: userPool
      });

      cognitoUser.confirmRegistration(verificationCode, true, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Authenticate user function
   * @param email 
   * @param password 
   * @returns Promise<resolve, reject>
   */
  authenticate(email, password) {
    return new Promise((resolve, reject) => {
      const userPool = new AWSCognito.CognitoUserPool(environment.cognito);

      const authDetails = new AWSCognito.AuthenticationDetails({
        Username: email,
        Password: password
      });

      const cognitoUser = new AWSCognito.CognitoUser({
        Username: email,
        Pool: userPool
      });

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: result => {
          resolve(result);
        },
        onFailure: err => {
          reject(err);
        },
        newPasswordRequired: userAttributes => {
          // User was signed up by an admin and must provide new
          // password and required attributes, if any, to complete
          // authentication.

          // the api doesn't accept this field back
          userAttributes.email = email;
          delete userAttributes.email_verified;

          cognitoUser.completeNewPasswordChallenge(password, userAttributes, {
            onSuccess: function (result) {
              resolve(result);
             },
            onFailure: function (error) {
              reject(error);
            }
          });
        }
      });
    });
  }

  /**
   * Validates a user session
   * @returns Promise<resolve, reject>
   */
  isSessionValid(): Promise<any> {
    return new Promise((resolve, reject) => {
      const userPool = new AWSCognito.CognitoUserPool(environment.cognito);
      if (userPool != null && userPool.getCurrentUser() !== null) {
        userPool.getCurrentUser().getSession((err, session) => {
          try {
            if (err) {
              reject(true);
            } else if (session.isValid()) {
              resolve(true);
            } else {
              reject(true);
            }
          } catch (e) {
            console.log(e);
            reject(true);
          }
        })
      } else {
        reject(true);
      }
    });
  }
}
