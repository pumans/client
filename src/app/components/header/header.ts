import { Component, inject } from '@angular/core';
import { Navigation } from './navigation/navigation';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  imports: [Navigation ],
})
export class HeaderComponent {
  public themeService = inject(ThemeService);
  public isMobileMenuOpen = false;
  isSearchOpen = false;

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }
  public toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
