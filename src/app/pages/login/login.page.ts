import { ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constants';
import { CognitoService } from 'src/app/services/cognito.service';
import { ToastUtil } from 'src/app/utils/toast';
import { environment } from '../../../environments/environment';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { ApiService } from 'src/app/services/api.service';
import { PhotoUtils } from 'src/app/utils/photo';
import { EventService } from 'src/app/services/event.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;
  loading: boolean = false;
  showLogo: boolean = true;

  constructor(
    private cognitoService: CognitoService,
    private apiService: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toast: ToastUtil,
    private cdr: ChangeDetectorRef,
    private photo: PhotoUtils,
    private event: EventService,
    private screenOrientation: ScreenOrientation,
    public appConstants: AppConstants) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: [environment.u, [Validators.required
      ]],
      password: [environment.p, [Validators.required
      ]],
    });
    this.orient();
  }

  async submit() {
    if (!this.form.valid) return false;
    this.loading = true;
    this.cognitoService.authenticate(this.form.controls.email.value, this.form.controls.password.value)
      .then(async (res: any) => {   
        //call this after authenticate and session refresh to reduce the trips to the server 
        //and infer image is persisted locally for during of session
        await this.apiService.loadPhoto();
        this.event.publishFormRefresh();
        this.router.navigate(['home']);
      }, async (err) => {
        if (err.code == "UserNotConfirmedException") {
          this.router.navigate(['signup-confirm', this.form.controls.email.value]);
        } else if (err.code == "NotAuthorizedException") {
          this.toast.error(err.message);
        } else {
          this.toast.error(err.message);
        }
      }).finally(() => {
        this.loading = false;
      });
  }

  orient() {
    this.screenOrientation.onChange().subscribe(
      () => {
        if (
          this.screenOrientation.type == this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY ||
          this.screenOrientation.type == this.screenOrientation.ORIENTATIONS.LANDSCAPE_SECONDARY) {
          this.showLogo = false;
        } else {
          this.showLogo = true;
        }
        this.cdr.detectChanges();
      }
    );
  }

  setFocus(nextElement) {
    nextElement.setFocus(); //For Ionic 4
    //nextElement.focus(); //older version
  }

}
