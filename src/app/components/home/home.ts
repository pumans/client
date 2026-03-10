import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero';
import { MainContent } from './main-content/main-content';
import { SidebarLeft } from '../sidebar-left/sidebar-left';
import { SidebarRight } from '../sidebar-right/sidebar-right';
import { ManLawComponent } from './man-law/man-law';
import { BottomContentComponent } from './bottom-content/bottom-content';

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    MainContent,
    SidebarLeft,
    SidebarRight,
    ManLawComponent,
    BottomContentComponent,
  ],
  templateUrl: './home.html',
})
export class Home {}
