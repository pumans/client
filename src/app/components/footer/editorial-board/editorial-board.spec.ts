import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorialBoard } from './editorial-board';

describe('EditorialBoard', () => {
  let component: EditorialBoard;
  let fixture: ComponentFixture<EditorialBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorialBoard],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorialBoard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
