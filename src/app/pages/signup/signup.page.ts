import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constants';
import { CognitoService } from 'src/app/services/cognito.service';
import { ToastUtil } from 'src/app/utils/toast';
import { CustomValidator } from 'src/app/validators/custom.validator';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

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
      ]],
      password: ['', [Validators.required,
                      Validators.minLength(8), 
                      Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
      ]],
      confirmPassword: ['', [Validators.required,
      ]]
    }, { 
      validator: CustomValidator.mustMatch('password', 'confirmPassword')
    }); 
    this.orient();
  }

  submit() {
    this.loading = true;
    this.cognitoService.signUp(
      this.form.controls.email.value,
      this.form.controls.password.value
    ).then(
      res => {
        this.router.navigate(['signup-confirm', this.form.controls.email.value]);
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
