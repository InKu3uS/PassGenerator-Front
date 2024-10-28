import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordsComponent } from './passwords.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasswordsComponent', () => {
  let component: PasswordsComponent;
  let fixture: ComponentFixture<PasswordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PasswordsComponent
      ],
      imports: [
        HttpClientTestingModule,

      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
