import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css',
  animations: [
    trigger('accordion-animation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.3s ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class FaqComponent {
  
  accordions:boolean[] = [false, false, false, false, false, false];

  
  toggleAccordion(index: number) {
    if (index >= 0 && index < this.accordions.length) {
      this.accordions[index] = !this.accordions[index];
    } else {
      console.error('Índice fuera de rango');
    }
  }
}
