import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { APIGatewayClient, CreateApiKeyCommand } from "@aws-sdk/client-api-gateway";
import { AppConstants } from '../app.constants';
import { CognitoService } from './cognito.service';
import { environment } from 'src/environments/environment';
import { Log } from '../utils/log';
import { PhotoUtils } from '../utils/photo';

var apigClientFactory = require('aws-api-gateway-client').default;
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
    private log: Log,
    private cognitoService: CognitoService,
    private photo: PhotoUtils,
    public appConstants: AppConstants
  ) { }

  post() {

    // const client = new APIGatewayClient(this.config());
    // console.log(client);
    // const command = new InvokeFunction({name: "hello"});
    // const response = await client.send();

    // return await this.httpClient.get("https://d2b6ppxw10.execute-api.us-east-1.amazonaws.com/dev/get-picture", {responseType: 'text'}).subscribe(result => {
    //   console.log(result);
    //   return result;
    // });

    // return this.httpClient.get("https://d2b6ppxw10.execute-api.us-east-1.amazonaws.com/dev/get-picture", {responseType: 'text'})

    // .pipe(
    //   tap(_ => console.log(`User fetched`))
    // );


    // return new Promise((resolve, reject) => {
    //   let additionalParams = {
    //   };
    //   apigClientFactory.newClient(this.getApiClientProps)
    //     .invokeApi({}, "/get-picture", 'GET', additionalParams, {})
    //     .then((res) => {
    //       resolve(res)
    //     }).catch((err) => {
    //       this.log.debug("post.error: " + err);
    //       reject({ message: err.message })
    //     });
    // })

  }

  getPhoto() {
    return new Promise((resolve, reject) => {
      let body = {
      }
      let additionalParams = {
        headers: {
          jwt: this.cognitoService.getToken()
        }
      };
      apigClientFactory.newClient(this.getApiClientProps)
        .invokeApi({}, "/get-picture", 'POST', additionalParams, body)
        .then((res) => {
          resolve(res)
        }).catch((err) => {
          this.log.error("post.error: " + err);
          this.log.error("make sure the identity provider role has the proper permission to invoke this endpoint");
          this.log.error("also make sure the api endpoint is configured properly");
          this.log.error("finally, check the server logs for details");
          reject({ message: err.message })
        });
    })
  }

  savePhoto(res) {
    return new Promise((resolve, reject) => {
      let body = {
        body: res,
      }
      let additionalParams = {
        headers: {
          jwt: this.cognitoService.getToken()
        }
      };
      apigClientFactory.newClient(this.getApiClientProps)
        .invokeApi({}, "/save-picture", 'POST', additionalParams, body)
        .then((res) => {
          resolve(res)
        }).catch((err) => {
          this.log.error("post.error: " + err);
          this.log.error("make sure the identity provider role has the proper permission to invoke this endpoint");
          this.log.error("also make sure the api endpoint is configured properly");
          this.log.error("finally, check the server logs for details");
          reject({ message: err.message })
        });
    })
  }

  async loadPhoto() {
    // console.log(this.cognitoService.getToken())
    const [err, res] = await this.getPhoto().
      then(v => [null, v], err => [err, null]);

    if (err) {
      this.log.error("Failed to retrieve photo, make sure you are authorized to perform this action");
    } else if (res) {
      // console.log(res.data)
      this.photo.saveLocalBase64Image(`data:image/png;base64,${res.data}`);
    }
  }

  get getApiClientProps(): {} {
    return {
      accessKey: sessionStorage.getItem(this.appConstants.ACCESSKEY),
      secretKey: sessionStorage.getItem(this.appConstants.SACCESSKEY),
      sessionToken: sessionStorage.getItem(this.appConstants.SESSIONTOKEN),
      defaultContentType: 'application/json',
      defaultAcceptType: 'application/json',
      region: environment.region,
      invokeUrl: environment.apiGatewayEndpoint
    }
  }
}