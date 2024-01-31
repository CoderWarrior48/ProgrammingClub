import { Component } from '@angular/core';
import { Links } from '../../data/links';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  links = Links
}
