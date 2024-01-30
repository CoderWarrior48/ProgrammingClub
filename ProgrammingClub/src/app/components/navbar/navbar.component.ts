import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  links = [
    {name: 'Contact', path: 'home'},
    {name: 'Portfolio', path: 'home'},
  ]
}