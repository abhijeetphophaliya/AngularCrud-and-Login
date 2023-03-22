import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css'],
})
export class ChildComponent {
  @Input() isLoggedIn: boolean;
  @Output() greetEvent = new EventEmitter();
  name = 'Message from child.........';

  callParentGreet() {
    this.greetEvent.emit(this.name);
  }
}
