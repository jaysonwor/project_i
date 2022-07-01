import { Injectable } from '@angular/core';
import * as AWSCognito from "amazon-cognito-identity-js";
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

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
  signUp(email, password): Promise<any> {
    return new Promise((resolve, reject) => {
      const userPool = new AWSCognito.CognitoUserPool(environment.cognito);

      let userAttribute = [];
      userAttribute.push(
        new AWSCognito.CognitoUserAttribute({ Name: "email", Value: email })
      );

      userPool.signUp(email, password, userAttribute, null, (err, result) => {
        if (err) {
          console.debug("signUp.error: " + err);
          reject(err);
        } else {
          console.debug("signUp.success: " + JSON.stringify(result));
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
    console.debug("logOut.success");
  }

  /**
   * Confirm user function
   * @param verificationCode 
   * @param email 
   * @returns Promise<resolve, reject>
   */
  confirmUser(verificationCode, email): Promise<any> {
    return new Promise((resolve, reject) => {
      const userPool = new AWSCognito.CognitoUserPool(environment.cognito);

      const cognitoUser = new AWSCognito.CognitoUser({
        Username: email,
        Pool: userPool
      });

      cognitoUser.confirmRegistration(verificationCode, true, function (err, result) {
        if (err) {
          console.debug("confirmUser.error: " + err);
          reject(err);
        } else {
          console.debug("confirmUser.success: " + JSON.stringify(result));
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
  authenticate(email, password): Promise<any> {
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
          console.debug("authenticate.success: " + JSON.stringify(result));
          resolve(result);
        },
        onFailure: err => {
          console.debug("authenticate.error: " + err);
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
              console.debug("authenticate.completeNewPasswordChallenge.success: " + JSON.stringify(result));
              resolve(result);
            },
            onFailure: function (error) {
              console.debug("authenticate.completeNewPasswordChallenge.error: " + error);
              reject(error);
            }
          });
        }
      });
    });
  }

  /**
   * Sends reset password code
   * @param email 
   */
  forgotPassword(email): Promise<any> {
    return new Promise((resolve, reject) => {
      const cognitoUser = new AWSCognito.CognitoUser({
        Username: email,
        Pool: new AWSCognito.CognitoUserPool(environment.cognito)
      });
      cognitoUser.forgotPassword({
        onSuccess: function (result) {
          console.debug("forgotPassword.success: " + JSON.stringify(result));
          resolve(result)
        },
        onFailure: function (error) {
          console.debug("forgotPassword.error: " + error);
          reject(error)
        },
        inputVerificationCode: function (result) {
          console.debug("forgotPassword.success: " + JSON.stringify(result));
          resolve(result)
        }
      })
    })
  }

  /**
   * Resets password
   * @param email 
   * @param verificationCode 
   * @param password 
   */
  confirmNewPassword(email: string, verificationCode: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const cognitoUser = new AWSCognito.CognitoUser({
        Username: email,
        Pool: new AWSCognito.CognitoUserPool(environment.cognito)
      });
      cognitoUser.confirmPassword(verificationCode, password, {
        onSuccess: function (result) {
          console.debug("forgotPassword.success: " + JSON.stringify(result));
          resolve(result);
        },
        onFailure: function (error) {
          console.debug("forgotPassword.error: " + error);
          switch (error.name) {
            case "LimitExceededException": {
              error.message = error.message;
              break;
            }
            case "CodeMismatchException": {
              error.message = error.message;
              break;
            }
            case "InvalidPasswordException": {
              error.message = "Password doesn't conform to the password policy";
              break;
            }
            default: {
              break;
            }
          }
          reject(error);
        }
      })
    })
  }

  /**
   * Change password of authenticated user
   * @param email 
   * @param oldPassword 
   * @param newPassword 
   */
   async changePassword(email: string, oldPassword: string, newPassword: string) {

    const userPool = new AWSCognito.CognitoUserPool(environment.cognito);
    const cognitoUser = userPool.getCurrentUser();
    await new Promise(res => cognitoUser.getSession(res));

    return new Promise((resolve, reject) => {      

      cognitoUser.changePassword(oldPassword, newPassword, (error, result) => {
        if (error) {
          console.debug("changePassword.error: " + error);
          reject(error);
        } else {
          console.debug("changePassword.success: " + JSON.stringify(result));
          resolve(result);
        }
      })
    })
  }

  /**
   * Resend registration confirmation code
   * @param email 
   * @returns Promise<resolve, reject>
   */
  resendCode(email): Promise<any> {
    return new Promise((resolve, reject) => {
      const cognitoUser = new AWSCognito.CognitoUser({
        Username: email,
        Pool: new AWSCognito.CognitoUserPool(environment.cognito)
      });
      cognitoUser.resendConfirmationCode((error, result) => {
        if (error) {
          console.debug("resendCode: error: " + error);
          reject(error)
        } else {
          console.debug("resendCode: success: " + JSON.stringify(result));
          resolve(result)
        }
      })
    })
  }

  getAttributes() {
    let attributes = null
    let idToken = JSON.parse(sessionStorage.getItem("IDTOKEN"));
    // console.log(idToken)
    const jwtHelper = new JwtHelperService();
    return attributes = jwtHelper.decodeToken(idToken);
  }

  get email() {
    return this.getAttributes()['email'];
  }

  /**
   * Updates logged in user attributes
   * @param attributes 
   * @returns 
   */
  async updateAttributes(attributes) {

    console.log(attributes)

    const userPool = new AWSCognito.CognitoUserPool(environment.cognito);
    let cognitoUser = userPool.getCurrentUser();
    await new Promise(res => cognitoUser.getSession(res));

    cognitoUser.updateAttributes(attributes, function (err, result) {
      console.log({ err, result });
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
              sessionStorage.setItem("SESSION.ACTIVE", false.toString());
              reject(true);
            } else if (session.isValid()) {
              sessionStorage.setItem("SESSION.ACTIVE", true.toString());
              sessionStorage.setItem("IDTOKEN", JSON.stringify(session.getIdToken().getJwtToken()));

              resolve(true);
            } else {
              sessionStorage.setItem("SESSION.ACTIVE", false.toString());
              reject(true);
            }
          } catch (e) {
            console.debug(e);
            sessionStorage.setItem("SESSION.ACTIVE", false.toString());
            reject(true);
          }
        })
      } else {
        sessionStorage.setItem("SESSION.ACTIVE", false.toString());
        reject(true);
      }
    });
  }
}
