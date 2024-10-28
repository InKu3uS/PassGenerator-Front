import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  constructor(private title: Title) {}

  /**
   * Cambia el titulo de la pestaña cuando no es la pestaña activa activa.
   * @param title titulo por defecto de la pestaña
   */
  blurTitle(title: string) {
    var link: HTMLLinkElement | null =
      document.querySelector("link[rel~='icon']");
    window.addEventListener('focus', (event) => {
      if (!link) {
        link = document.createElement('link');
      }
      link.href = 'favicon.ico';
      link.type = 'image/png';
      link.href = 'favicon.ico';
      document.getElementsByTagName('head')[0].appendChild(link);
      this.title.setTitle(title);
    });
    window.addEventListener('blur', (event) => {
      setTimeout(() => {
        if (!link) {
          link = document.createElement('link');
        }
        link.rel = 'shortcut icon';
        link.type = 'image/gif';
        link.href = 'lock.gif';
        document.getElementsByTagName('head')[0].appendChild(link);
        this.title.setTitle('Hey!! Sigues ahi?');
      }, 15000);
    });
  }
}
