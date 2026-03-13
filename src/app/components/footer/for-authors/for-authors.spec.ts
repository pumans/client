import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForAuthors } from './for-authors';

describe('ForAuthors', () => {
  let component: ForAuthors;
  let fixture: ComponentFixture<ForAuthors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForAuthors],
    }).compileComponents();

    fixture = TestBed.createComponent(ForAuthors);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
