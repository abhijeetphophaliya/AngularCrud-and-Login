import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeesListComponent } from './components/employees/employees-list/employees-list.component';
import { AddEmployeeComponent } from './components/employees/add-employee/add-employee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditEmployeeComponent } from './components/employees/edit-employee/edit-employee.component';
import { ConfirmationDialogComponent } from './commen/confirmation-dialog/confirmation-dialog.component';

import { ConfirmationDialogService } from './commen/confirmation-dialog/confirmation-dialog.service';
import { LoginComponent } from './components/authentication/login/login.component';
import { SignupComponent } from './components/authentication/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';

import { NgToastModule } from 'ng-angular-popup';
import { AuthGuard } from './guards/auth.guard';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ParentComponent } from './components/input-component-communication/parent/parent.component';
import { ChildComponent } from './components/input-component-communication/child/child.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeesListComponent,
    AddEmployeeComponent,
    EditEmployeeComponent,
    ConfirmationDialogComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    ResetPasswordComponent,
    ParentComponent,
    ChildComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgToastModule,
  ],
  providers: [
    ConfirmationDialogService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
