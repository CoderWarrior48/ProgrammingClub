import { Component } from '@angular/core';
import { Links } from '../../data/links';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  links = Links
}