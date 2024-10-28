import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavePasswordComponent } from './save-password.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('SavePasswordComponent', () => {
  let component: SavePasswordComponent;
  let fixture: ComponentFixture<SavePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SavePasswordComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
