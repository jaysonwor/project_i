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

  getVideo() {
    return new Promise((resolve, reject) => {
      let body = {
      }
      let additionalParams = {
        headers: {
          jwt: this.cognitoService.getToken()
        }
      };
      apigClientFactory.newClient(this.getApiClientProps)
        .invokeApi({}, "/get-video", 'POST', additionalParams, body)
        .then((res) => {
          resolve(res)
        }).catch((err) => {
          reject({ message: err.message })
        });
    })
  }

  async saveVideo(form) {
    return new Promise((resolve, reject) => {
      let body = {
        body: form,
      }
      let additionalParams = {
        headers: {
          jwt: this.cognitoService.getToken(),
          toast: `AWS ${sessionStorage.getItem(this.appConstants.ACCESSKEY)}:${sessionStorage.getItem(this.appConstants.SACCESSKEY)}:${sessionStorage.getItem(this.appConstants.SESSIONTOKEN)}`,
        }
      };

      // try {
      //   const response = await apigClientFactory.newClient(this.getApiClientProps)
      //     .invokeApi({}, "/get-upload-url", 'POST', additionalParams, {})
      //     try {
      //       this.uploadVideoToS3(response.data.url, form)

      //     } catch (error) {
      //       console.error('Error uploading video:', error);
      //     }
      //   console.log('Response:', JSON.stringify(response.data.url)); 
      // } catch (error) {
      //   console.error('Error uploading video:', error);
      // } 


      apigClientFactory.newClient(this.getApiClientProps)
        // .invokeApi({}, "/save-video", 'POST', additionalParams, body)
        .invokeApi({}, "/get-upload-url", 'POST', additionalParams, {})
        .then((res) => {
          // console.log(JSON.stringify(res))
          console.log(res.data.url)
          this.uploadVideoToS3(res.data.url, form)
          .then((res) => {
            resolve(res)    
          })
          .catch((err) => {
            reject(err)
          });
          
        }).catch((err) => {
          this.log.error(JSON.stringify(err))
          reject("failed to get upload url")
        });
    })
  }

  private uploadVideoToS3(presignedUrl: string, base64Data: string) {
    return new Promise((resolve, reject) => {
      const binaryData = atob(base64Data);
      const len = binaryData.length;
      const buffer = new Uint8Array(len);

      for (let i = 0; i < len; i++) {
        buffer[i] = binaryData.charCodeAt(i);
      }

      const blob = new Blob([buffer], { type: 'video/webm' });
      const formData = new FormData();
      formData.append('video', blob, "fileName");

      // Perform a PUT request directly to the pre-signed URL to upload the video to S3
      this.httpClient.put(presignedUrl, blob).subscribe(
        (res) => {
          console.log('Video uploaded successfully:', res);
          resolve(res)    
        },
        (error) => {
          console.error('Error uploading video to S3:', error);
          reject('Error uploading video to S3')
        }
      );
    })
  }

  listVideos() {
    return new Promise((resolve, reject) => {
      let body = {
        body: {}
      }
      let additionalParams = {
        headers: {
          jwt: this.cognitoService.getToken()
        }
      };
      apigClientFactory.newClient(this.getApiClientProps)
        .invokeApi({}, "/list-videos", 'POST', additionalParams, body)
        .then((res) => {
          resolve(res)    
        }).catch((err) => {
          this.log.error(JSON.stringify(err))
          reject("failed to list videos")
        });
    })
  }

  deleteVideo(url) {
    return new Promise((resolve, reject) => {
      let body = {
        url: url
      }
      let additionalParams = {
        headers: {
          jwt: this.cognitoService.getToken()
        }
      };
      apigClientFactory.newClient(this.getApiClientProps)
        .invokeApi({}, "/delete-video", 'POST', additionalParams, body)
        .then((res) => {
          resolve(res)    
        }).catch((err) => {
          this.log.error(JSON.stringify(err))
          reject("failed to delete video")
        });
    })
  }

  countVideos() {
    return new Promise((resolve, reject) => {
      let body = {
        body: {}
      }
      let additionalParams = {
        headers: {
          jwt: this.cognitoService.getToken()
        }
      };
      apigClientFactory.newClient(this.getApiClientProps)
        .invokeApi({}, "/count-videos", 'GET', additionalParams, {})
        .then((res) => {
          resolve(res)    
        }).catch((err) => {
          this.log.error(JSON.stringify(err))
          reject("failed to count videos")
        });
    })
  }

  uploadVideo(form) {
    return new Promise((resolve, reject) => {
      let body = {
        body: form,
      }
      let additionalParams = {
        headers: {
          jwt: this.cognitoService.getToken()
        }
      };
      apigClientFactory.newClient(this.getApiClientProps)
        .invokeApi({}, "/upload-video", 'POST', additionalParams, body)
        .then((res) => {
          resolve(res)    
        }).catch((err) => {
          this.log.error(JSON.stringify(err))
          reject("failed to upload")
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
      // defaultContentType: 'multipart/form-data',
      // defaultAcceptType: 'multipart/form-data',
      region: environment.region,
      invokeUrl: environment.apiGatewayEndpoint
    }
  }
}