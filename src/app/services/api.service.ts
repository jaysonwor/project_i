import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { APIGatewayClient, CreateApiKeyCommand } from "@aws-sdk/client-api-gateway";
import { AppConstants } from '../app.constants';
import { CognitoService } from './cognito.service';
import { environment } from 'src/environments/environment';

var apigClientFactory = require('aws-api-gateway-client').default;
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
    public appConstants: AppConstants
    ) { }

  // config() {
  //   // this.credentials = new AWSStaticCredentialsProvider(new BasicAWSCredentials(accessKey, secretAccessKey));
  //   // AWS.config = new AWS.Config();
  //   // AWS.config.accessKeyId = "accessKey";
  //   // AWS.config.secretAccessKey = "secretKey";
  //   // AWS.config.region = "us-east-1";

  //   return { 
  //     // endpoint: "https://of0bp08kk9.execute-api.us-east-1.amazonaws.com/dev", 
  //     endpoint: "https://outsrlrh5g.execute-api.us-east-1.amazonaws.com/dev",
  //     region: "us-east-1", 
  //     credentials:  fromCognitoIdentityPool({
  //       clientConfig: { region: "us-east-1" }, // Configure the underlying CognitoIdentityClient.
  //       identityPoolId: environment.identityPoolId,
  //     })
  //   }
  // }

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

      return new Promise((resolve, reject) => {
        let additionalParams = {
        };
        apigClientFactory.newClient(this.getApiClientProps)
          .invokeApi({}, "/get-picture", 'GET', additionalParams, {})
          .then((res) => {
            resolve(res)
          }).catch((err) => {
            console.log("ResultsService.getResults:" + err);
            reject({ message: err.message })
          });
      })
    
  }

  securedPost() {
     
    const client = new APIGatewayClient({ region: "REGION" });

    // return this.httpClient.get("https://d2b6ppxw10.execute-api.us-east-1.amazonaws.com/dev/get-picture", {responseType: 'text'})
    
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