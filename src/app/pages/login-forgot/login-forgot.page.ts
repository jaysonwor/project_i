import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constants';
import { CognitoService } from 'src/app/services/cognito.service';
import { ToastUtil } from 'src/app/utils/toast';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-login-forgot',
  templateUrl: './login-forgot.page.html',
  styleUrls: ['./login-forgot.page.scss'],
})
export class LoginForgotPage implements OnInit {

  form: FormGroup;
  loading: boolean = false;
  showLogo: boolean = true;

  constructor(
    private cognitoService: CognitoService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toast: ToastUtil,
    private cdr: ChangeDetectorRef,
    private screenOrientation: ScreenOrientation,
    public appConstants: AppConstants) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')
      ]]
    });
    this.orient();
  }

  submit() {
    this.loading = true;
    this.cognitoService.forgotPassword(this.form.controls.email.value)
    .then(
      res => {
        this.router.navigate(['password-reset', this.form.controls.email.value]);
      },
      err => {
        this.toast.error(err.message);
      }
    ).finally(() => {
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


}
