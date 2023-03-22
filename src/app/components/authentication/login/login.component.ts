import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

import { NgToastService } from 'ng-angular-popup';
import { UserStoreService } from 'src/app/services/user-store.service';
import { ResetPasswordService } from 'src/app/services/reset-password.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public resetPasswordEmail: string = '';
  public isValidEmail: boolean = false;

  @Output() emitUserNameEvent = new EventEmitter();

  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toast: NgToastService,
    private authService: AuthService,
    private userStore: UserStoreService,
    private resetPasswordService: ResetPasswordService
  ) {}
  loginForm: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLoginSubmit() {
    if (this.loginForm.valid) {
      this.authService.loginUser(this.loginForm.value).subscribe({
        next: (response) => {
          console.log(response.message);
          this.toast.success({
            detail: 'SUCCESS',
            summary: response.message,
            duration: 5000,
          });

          console.log("After login " + this.loginForm.value.username);
          this.emitUserNameEvent.emit(this.loginForm.value.username);

          this.authService.storeRefreshToken(response.refreshToken);
          this.authService.storeToken(response.accessToken);

          this.loginForm.reset();

          const tokenPayload = this.authService.decodedToken();
          this.userStore.setFullNameForStore(tokenPayload.unique_name);
          this.userStore.setRoleForStore(tokenPayload.role);

          this.router.navigate(['']);
        },
        error: (response) => {
          this.errorMessage = 'Invalid Credentials';
          this.toast.error({
            detail: 'ERROR',
            summary: response.error.message,
            duration: 5000,
            sticky: true,
          });
          this.loginForm.reset();
          console.log(response);
        },
      });
    } else {
      ValidateForm.ValidateAllFormFields(this.loginForm);
    }
  }

  checkValidEmail(event: string) {
    const value = event;
    const pattern = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }

  confirmToSend() {
    if (this.checkValidEmail(this.resetPasswordEmail)) {
      console.log(this.resetPasswordEmail);
    }

    this.resetPasswordService
      .sendResetPasswordLink(this.resetPasswordEmail)
      .subscribe({
        next: (res) => {
          this.toast.success({
            detail: 'SUCCESS',
            summary: 'Reset Success',
            duration: 5000,
          });

          this.resetPasswordEmail = '';
          const buttonRef = document.getElementById('closeBtn');
          buttonRef?.click();
        },
        error: (err) => {
          this.toast.error({
            detail: 'ERROR',
            summary: 'Something went wrong',
            duration: 5000,
            sticky: true,
          });
        },
      });
  }
}
