import { Component, OnInit } from '@angular/core';
// import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { Filesystem, Directory } from '@capacitor/filesystem';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
// import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
// import { ImagePicker } from '@ionic-native/image-picker/ngx';
// import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { AppConstants } from 'src/app/app.constants';
import { CognitoService } from 'src/app/services/cognito.service';
import { Toast } from 'src/app/utils/toast';
import { PhotoUtils } from 'src/app/utils/photo';
import { Log } from 'src/app/utils/log';
// import {
//   Capacitor,
//   Plugins,
// } from '@capacitor/core';

// const { Filesystem, Directory } = Plugins;

// const IMAGE_DIR = 'stored-images';

// interface LocalFile {
//   name: string;
//   path: string;
//   data: string;
// }

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  debug: String[] = [];
  // images: LocalFile[] = [];
  form: FormGroup;
  name: string;
  imgPreview: any = '';
  // private static _directory = Directory.Cache;

  constructor(
    // private plt: Platform,
    private cognitoService: CognitoService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toast: Toast,
    private photo: PhotoUtils,
    public appConstants: AppConstants,
    public log: Log) {
  }

  async ionViewWillEnter() {
    this.getAttributes();
    // this.log.reset();
  }

  async ngOnInit() {
    this.getAttributes();
    this.form = this.formBuilder.group({
      // email: ['', [Validators.required
      // ]],      
      name: [this.name, [Validators.required
      ]],
    })
    //todo load from local image or s3
    this.imgPreview = await this.photo.loadProfilePic();
  }

  submit() {
    this.cognitoService.updateAttributes(this.formatAttributes()).then(
      res => {
        this.toast.success("Profile updated");
      },
      err => {
        this.toast.error(err.message);
      }
    )
  }

  private formatAttributes() {
    let attributes = [
      {
        Name: "name",
        Value: this.form.controls.name.value
      },
    ]
    return attributes
  }

  private getAttributes() {
    let attributes = this.cognitoService.getAttributes();
    this.name = attributes['name'];
  }

  async selectImage() {
    const [err, res] = await this.photo.chooseImage().
      then(v => [null, v], err => [err, null]);

    if (err) {
      this.toast.error(err)
    } else {
      this.imgPreview = res;
      //todo save to s3
    }

  }


}
