import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public slides = [
    { src: "assets/images/game_design.jpg", title: "Games" },
    { src: "assets/images/web_development.png", title: "Apps" },
    { src: "assets/images/data_science.jpg", title: "Data Algorithims" },
  ];
}
