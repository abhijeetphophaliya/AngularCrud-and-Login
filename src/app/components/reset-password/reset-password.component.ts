import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ResetPassword } from 'src/app/models/reset-password-model';
import { ConfirmPasswordValidator } from 'src/app/helpers/confirm-password.validator';
import { ResetPasswordService } from 'src/app/services/reset-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toast: NgToastService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private resetPasswordService: ResetPasswordService
  ) {}

  errorMessage: string = '';
  resetPassswordForm: FormGroup;
  emailToReset!: string;
  emailToken!: string;
  resetPasswordObj = new ResetPassword();

  ngOnInit(): void {
    this.resetPassswordForm = this.fb.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: ConfirmPasswordValidator('password', 'confirmPassword'),
      }
    );

    this.route.queryParams.subscribe((val) => {
      this.emailToReset = val['email'];
      let uriToken = val['code'];
      this.emailToken = uriToken.replace(/ /g, '+');
    });
  }

  onResetPasswordSubmit() {
    if (this.resetPassswordForm.valid) {
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.emailToken = this.emailToken;
      this.resetPasswordObj.newPassword =
        this.resetPassswordForm.value.password;
      this.resetPasswordObj.confirmPassword =
        this.resetPassswordForm.value.confirmPassword;

      this.resetPasswordService.resetPassword(this.resetPasswordObj).subscribe({
        next: (res) => {
          this.toast.success({
            detail: 'SUCCESS',
            summary: 'Reset Success',
            duration: 5000,
          });
          this.router.navigate(['']);
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
    } else {
      ValidateForm.ValidateAllFormFields(this.resetPassswordForm);
    }
  }
}
