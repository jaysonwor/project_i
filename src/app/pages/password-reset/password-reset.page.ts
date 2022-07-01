import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constants';
import { CognitoService } from 'src/app/services/cognito.service';
import { ToastUtil } from 'src/app/utils/toast';
import { CustomValidator } from 'src/app/validators/custom.validator';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {

  form: FormGroup;
  email: string;
  private sub: any;

  constructor(
    private cognitoService: CognitoService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toast: ToastUtil,
    public appConstants: AppConstants) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      verifyCode: ['', [Validators.required
      ]],
      password: ['', [Validators.required,
                      Validators.minLength(8), 
                      Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
      ]],
      confirmPassword: ['', [Validators.required,
      ]]
    }, { 
      validator: CustomValidator.mustMatch('password', 'confirmPassword')
    })
    //extracts param from the url
    this.sub = this.route.params.subscribe(params => {
      this.email = params['email'];
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  submit() {
    this.cognitoService.confirmNewPassword(
      this.email,
      this.form.controls.verifyCode.value,
      this.form.controls.password.value
    ).then(
      res => {
        this.toast.success("Password was reset");
        this.router.navigate(['login']);
      },
      err => {
        this.toast.error(err.message);
      }
    )
  }


}
