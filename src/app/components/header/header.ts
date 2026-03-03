import { Component } from '@angular/core';
import { Navigation } from '../navigation/navigation';


@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  imports: [Navigation],
})
export class HeaderComponent {
  public isMobileMenuOpen = false;
  isSearchOpen = false;

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }
  public toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
