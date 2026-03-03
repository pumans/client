import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero';
import { MainContent } from '../main-content/main-content';
import { SidebarLeft } from '../sidebar-left/sidebar-left';
import { SidebarRight } from '../sidebar-right/sidebar-right';

@Component({
  selector: 'app-home',
  imports: [HeroComponent, MainContent, SidebarLeft, SidebarRight],
  templateUrl: './home.html',
  styles: [
    `
      .container {
        max-width: 1200px;
        margin: 20px auto;
        padding: 0 15px;
      }
    `,
  ],
})
export class Home {}
