import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
})
export class Pagination {
  currentPage = input.required<number>();
  visiblePages = input.required<number[]>();
  hasNextPage = input.required<boolean>();
  pageSize = input.required<number>();

  pageChange = output<number>();
  pageSizeChange = output<number>();

  // ВАЖЛИВО: Тут обов'язково мають бути 9, 10 та 12
  public pageSizeOptions = [5, 9, 10, 12, 15, 20, 50];

  goToPage(page: number) {
    this.pageChange.emit(page);
  }

  onPrev() {
    if (this.currentPage() > 1) {
      this.pageChange.emit(this.currentPage() - 1);
    }
  }

  onNext() {
    if (this.hasNextPage()) {
      this.pageChange.emit(this.currentPage() + 1);
    }
  }

  onPageSizeChange(value: string) {
    this.pageSizeChange.emit(Number(value));
  }
}
