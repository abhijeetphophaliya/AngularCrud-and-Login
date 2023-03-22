import { Component,  OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UserStoreService } from './services/user-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'FullStack.UI';

  constructor(
    public authService: AuthService,
    private userStore: UserStoreService
  ) {}

  fullName: string = '';

  ngOnInit(): void {
    this.userStore.getFullNameFromStore().subscribe((val) => {
      let fullnameFromToken = this.authService.getFullnameFromToken();
      this.fullName = val || fullnameFromToken;
    });
  }

  logOutUser() {
    this.authService.signOut();
  }
}
