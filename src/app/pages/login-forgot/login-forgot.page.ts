import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constants';
import { CognitoService } from 'src/app/services/cognito.service';
import { Toast } from 'src/app/utils/toast';

@Component({
  selector: 'app-login-forgot',
  templateUrl: './login-forgot.page.html',
  styleUrls: ['./login-forgot.page.scss'],
})
export class LoginForgotPage implements OnInit {

  form: FormGroup;

  constructor(
    private cognitoService: CognitoService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toast: Toast,
    public appConstants: AppConstants) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')
      ]]
    });
  }

  submit() {
    this.cognitoService.forgotPassword(this.form.controls.email.value).then(
      res => {
        this.router.navigate(['password-reset', this.form.controls.email.value]);
      },
      err => {
        this.toast.error(err.message);
      }
    )

  }


}
