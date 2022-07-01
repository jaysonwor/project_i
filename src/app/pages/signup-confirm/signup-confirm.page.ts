import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConstants } from 'src/app/app.constants';
import { CognitoService } from 'src/app/services/cognito.service';
import { ToastUtil } from 'src/app/utils/toast';

@Component({
  selector: 'app-signup-confirm',
  templateUrl: './signup-confirm.page.html',
  styleUrls: ['./signup-confirm.page.scss'],
})
export class SignupConfirmPage implements OnInit {

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
      verifyCode: ['', [Validators.required]]
    });
    //extracts param from the url
    this.sub = this.route.params.subscribe(params => {
      this.email = params['email'];
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  submit() {
    this.cognitoService.confirmUser(
      this.form.controls.verifyCode.value,
      this.email
    ).then(
      (res) => {
        this.toast.success("User signup complete");
        this.router.navigate(['login']);
      },
      err => {
        this.toast.error(err.message);
      }
    );
  }

  resend() {
    this.cognitoService.resendCode(this.email).then(
      res => {
        this.toast.info("Code resent, check email");
      },
      err => {
        this.toast.error(err.message);
      }
    );
  }


}
