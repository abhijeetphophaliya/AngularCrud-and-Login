import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/commen/confirmation-dialog/confirmation-dialog.service';
import { Employee } from 'src/app/models/employee.model';
import { EmployeesService } from 'src/app/services/employees.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css'],
})
export class EditEmployeeComponent implements OnInit {
  employeeDetails: Employee = {
    id: '',
    name: '',
    phone: '',
    email: '',
    salary: '',
    department: '',
  };

  constructor(
    private employeeService: EmployeesService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  updateEmployee() {
    this.employeeService
      .updateEmployee(this.employeeDetails.id, this.employeeDetails)
      .subscribe({
        next: (response) => this.router.navigate(['employees']),
        error: (response) => console.log(response),
      });
  }

  deleteEmployee(employeeId: string) {
    this.confirmationDialogService
      .confirm('Please confirm..', 'Do you really want to Delete... ?')
      .then((confirmed) => {
        if (confirmed) {
          this.deleteEmployeeById();
        }
      })
      .catch(() =>
        console.log(
          'User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'
        )
      );
  }

  deleteEmployeeById() {
    this.employeeService.deleteEmployee(this.employeeDetails.id).subscribe({
      next: (response) => this.router.navigate(['employees']),
      error: (response) => console.log(response),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const employeeId = params.get('id');

        if (employeeId) {
          this.employeeService.getEmployeeById(employeeId).subscribe({
            next: (response) => (this.employeeDetails = response),
            error: (response) => console.log(response),
          });
        }
      },
    });
  }
}
