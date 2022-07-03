import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConstants } from 'src/app/app.constants';
import { CognitoService } from 'src/app/services/cognito.service';
import { ToastUtil } from 'src/app/utils/toast';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
@Component({
  selector: 'app-signup-confirm',
  templateUrl: './signup-confirm.page.html',
  styleUrls: ['./signup-confirm.page.scss'],
})
export class SignupConfirmPage implements OnInit {

  form: FormGroup;
  email: string;
  loading: boolean = false;
  private sub: any;
  showLogo: boolean = true;

  constructor(
    private cognitoService: CognitoService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toast: ToastUtil,
    private cdr: ChangeDetectorRef,
    private screenOrientation: ScreenOrientation,
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
    this.loading = true;
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
    ).finally(() => {
      this.loading = false;
    });
  }

  resend() {
    this.loading = true;
    this.cognitoService.resendCode(this.email).then(
      res => {
        this.toast.info("Code resent, check email");
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
