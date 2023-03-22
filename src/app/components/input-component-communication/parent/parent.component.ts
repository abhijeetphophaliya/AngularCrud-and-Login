import { Component } from '@angular/core';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css'],
})
export class ParentComponent {
  userLoggedIn: boolean = true;

  greetParent(event: string) {
    console.log('Parent received = ' + event);
  }
}
