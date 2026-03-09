import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simple-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './simple-pagination.html',
})
export class SimplePagination {
  currentPage = input.required<number>();
  visiblePages = input.required<number[]>();
  hasNextPage = input.required<boolean>();

  pageChange = output<number>();

  onPrev(): void {
    if (this.currentPage() > 1) {
      this.pageChange.emit(this.currentPage() - 1);
    }
  }

  onNext(): void {
    if (this.hasNextPage()) {
      this.pageChange.emit(this.currentPage() + 1);
    }
  }

  goToPage(p: number): void {
    if (p !== this.currentPage() && p >= 1) {
      this.pageChange.emit(p);
    }
  }
}
