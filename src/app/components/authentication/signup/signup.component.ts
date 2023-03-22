import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';
import {  Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toast: NgToastService,
    private authService: AuthService
  ) {}

  signUpForm: FormGroup;
  errorMessage: string = '';

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSignUpSubmit() {
    if (this.signUpForm.valid) {
      this.authService.signUpUser(this.signUpForm.value).subscribe({
        next: (response) => {
          console.log(response);
          this.toast.success({
            detail: 'SUCCESS',
            summary: response.message,
            duration: 5000,
          });
          this.signUpForm.reset();
          this.router.navigate(['login']);
        },
        error: (response) => {
          console.log(response);
          this.toast.error({
            detail: 'ERROR',
            summary: response.message,
            duration: 5000,
            sticky: true,
          });
          this.errorMessage = response.message;
          console.log(response.message);
        },
      });
    } else {
      ValidateForm.ValidateAllFormFields(this.signUpForm);
    }
  }
}
