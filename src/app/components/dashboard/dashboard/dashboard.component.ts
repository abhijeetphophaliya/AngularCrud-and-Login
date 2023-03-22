import { Component,OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  role: string = '';

  constructor(
    public authService: AuthService,
    private userStore: UserStoreService
  ) {}


  ngOnInit(): void {
    this.userStore.getRoleFromStore().subscribe((val) => {
      let roleFromToken = this.authService.getRoleFromToken();
      this.role = val || roleFromToken;
    });
  }

  
}