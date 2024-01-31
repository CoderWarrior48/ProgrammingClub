import { Component, Input } from '@angular/core';
import { fadeIn, fadeOut } from './carousel.animations';
import { trigger, transition, useAnimation} from "@angular/animations";

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  animations: [
    trigger("carouselAnimation", [
      transition("void => *", [useAnimation(fadeIn, {params: { time: '1300ms' }} )]),
      transition("* => void", [useAnimation(fadeOut, {params: { time: '1300ms' }})]),
    ])
  ]
})
export class CarouselComponent {
  @Input() slides: any;

  currentSlide = 0;

  constructor() {}

  onPreviousClick() {
    const previous = this.currentSlide - 1;
    this.currentSlide = previous < 0 ? this.slides.length - 1 : previous;
    console.log("previous clicked, new current slide is: ", this.currentSlide);
  }

  onNextClick() {
    const next = this.currentSlide + 1;
    this.currentSlide = next === this.slides.length ? 0 : next;
    console.log("next clicked, new current slide is: ", this.currentSlide);
  }
}
