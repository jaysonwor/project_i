import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constants';
import { CognitoService } from 'src/app/services/cognito.service';
import { Toast } from 'src/app/utils/toast';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

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
      email: ['', [Validators.required
      ]],
      password: ['', [Validators.required
      ]],
    })
  }

  submit() {
    if (!this.form.valid) return false;
    this.cognitoService.authenticate(this.form.controls.email.value, this.form.controls.password.value)
      .then((res: any) => {
        this.router.navigate(['home']);
      }, async (err) => {
        if (err.code == "UserNotConfirmedException") {
          this.router.navigate(['signup-confirm', this.form.controls.email.value]);
        } else if (err.code == "NotAuthorizedException") {
          this.toast.error(err.message);        
        } else {
          this.toast.error(err.message);                  
        }        
      });
  }

}
