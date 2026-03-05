import { Component, OnInit, inject } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { Article } from '../../models/article';
//import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [],
  templateUrl: './main-content.html',
})
export class MainContent implements OnInit {
  private newsService = inject(NewsService);
  //public sections: any[] = [];
  public sections = [
    {
      title: 'СУДОВА ПРАКТИКА',
      articles: [
        {
          title: 'Позиція Верховного Суду щодо трудових спорів про незаконне звільнення',
          image:
            'https://images.unsplash.com/photo-1767972463877-b64ba4283cd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXZlbCUyMGp1ZGdlJTIwY291cnR8ZW58MXx8fHwxNzcyMTAxMzkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          title: 'Нова практика господарських судів у справах про банкрутство',
          image:
            'https://images.unsplash.com/photo-1598139384902-5a8217874645?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGxhdyUyMG9mZmljZXxlbnwxfHx8fDE3NzIxMDEzOTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        },
      ],
    },
    {
      title: 'ПРОКУРОРСЬКА ПРАКТИКА',
      articles: [
        {
          title: 'Оскарження бездіяльності прокурора: процедура та строки',
          image:
            'https://images.unsplash.com/photo-1711365306958-577e114787ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmltaW5hbCUyMGxhdyUyMHBvbGljZXxlbnwxfHx8fDE3NzIxMDEzOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          title: 'Повноваження прокурора у цивільному процесі',
          image:
            'https://images.unsplash.com/photo-1685747750264-a4e932005dde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VydGhvdXNlJTIwYnVpbGRpbmclMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzcyMDEyNDEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
        },
      ],
    },
    {
      title: 'АДВОКАТСЬКА ПРАКТИКА',
      articles: [
        {
          title: 'Етичні правила адвокатської діяльності: нові вимоги',
          image:
            'https://images.unsplash.com/photo-1758518731462-d091b0b4ed0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXd5ZXIlMjBjb25zdWx0YXRpb24lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcyMDk2NTMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          title: 'Дисциплінарна відповідальність адвоката: підстави та процедура',
          image:
            'https://images.unsplash.com/photo-1769092992534-f2d0210162b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWdhbCUyMGJvb2tzJTIwbGlicmFyeSUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NzIxMDEzOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        },
      ],
    },
    {
      title: 'МІЖНАРОДНЕ ПРАВО',
      articles: [
        {
          title: 'Рішення Європейського суду з прав людини у справах проти України',
          image:
            'https://images.unsplash.com/photo-1763729805496-b5dbf7f00c79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbnRyYWN0JTIwc2lnbmluZ3xlbnwxfHx8fDE3NzIxMDA4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          title: 'Імплементація директив ЄС у національне законодавство',
          image:
            'https://images.unsplash.com/photo-1565414791381-056c6ab0f8c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzcGFwZXIlMjBsYXclMjBsZWdhbCUyMG5ld3N8ZW58MXx8fHwxNzcyMTAxMzkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        },
      ],
    },
    {
      title: 'ПРАВО В ІНТЕРНЕТІ',
      articles: [
        {
          title: 'Захист персональних даних: GDPR та українське законодавство',
          image:
            'https://images.unsplash.com/photo-1762152212840-3ec91c031d52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YXglMjBkb2N1bWVudHMlMjBmaW5hbmNpYWx8ZW58MXx8fHwxNzcyMTAxMzkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          title: 'Кіберзлочинність: відповідальність та запобігання',
          image:
            'https://images.unsplash.com/photo-1528747008803-f9f5cc8f1a64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBjb25zdWx0YXRpb24lMjBsYXd5ZXJ8ZW58MXx8fHwxNzcyMTAwODEwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        },
      ],
    },
  ];

  ngOnInit() {
    // Завантажуємо реальну новину з вашої бази даних

  }
}
