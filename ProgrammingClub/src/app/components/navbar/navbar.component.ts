import { Component, OnInit,  } from '@angular/core';
import { Links } from '../../data/links';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  links = Links
  nav = "nav_trans"
  debug = 5

  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollEvent, true);
  }

  scrollEvent = (event: any): void => {
    this.nav = "nav_solid"
    // if(window.scrollY==0){
    //   this.nav = "nav_trans"
    // } else {
    //   this.nav = "nav_solid"
    // }
    this.debug = window.scrollY
    
  }

    
}