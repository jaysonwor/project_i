import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constants';
import { CognitoService } from 'src/app/services/cognito.service';
import { ToastUtil } from 'src/app/utils/toast';
import { PhotoUtils } from 'src/app/utils/photo';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  debug: String[] = [];
  form: FormGroup;
  name: string;
  imgPreview: any = '';
  loading: boolean = false;
  loadingPic: boolean = false;

  constructor(
    private cognitoService: CognitoService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toast: ToastUtil,
    private photo: PhotoUtils,
    public appConstants: AppConstants) {
  }

  async ionViewWillEnter() {
    this.getAttributes();
  }

  async ngOnInit() {
    this.getAttributes();
    this.form = this.formBuilder.group({
      name: [this.name, [Validators.required
      ]],
    })
    //todo load from local image or s3
    this.imgPreview = await this.photo.loadProfilePic();
  }

  submit() {
    this.loading = true;
    this.cognitoService.updateAttributes(this.formatAttributes())
    .then(
      res => {
        this.toast.success("Profile updated");
      },
      err => {
        this.toast.error(err.message);
      }
    ).finally(() => {
      this.loading = false;
    });
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
    this.loadingPic = true;
    const [err, res] = await this.photo.chooseImage().
      then(v => [null, v], err => [err, null]);

    if (err) {
      this.toast.error(err)
    } else {
      this.imgPreview = res;
      //todo save to s3
    }
    this.loadingPic = false;

  }


}
