import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.html',
  imports: [RouterLink],
})
export class HeroComponent {
  public featuredArticles = [
    {
      id: 1,
      title: 'Підтримка сталого миру в Україні - резолюція ГА ООН',
      image:
        'https://images.unsplash.com/photo-1771340590603-43495f76e9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1a3JhaW5lJTIwZmxhZyUyMGp1c3RpY2UlMjBsYXd8ZW58MXx8fHwxNzcyMTAwODA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'МІЖНАРОДНЕ ПРАВО',
    },
    {
      id: 2,
      title: 'Верховна Рада ухвалила закон про протидію корупції',
      image:
        'https://images.unsplash.com/photo-1685747750264-a4e932005dde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VydGhvdXNlJTIwYnVpbGRpbmclMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzcyMDEyNDEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'ЗАКОНОДАВСТВО',
    },
  ];
}
