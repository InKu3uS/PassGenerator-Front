import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/auth/auth.service';
import { UsersService } from '../../services/users/users.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let usersServiceMock: jasmine.SpyObj<UsersService>;

  beforeEach(async () => {
    // Crear un mock para AuthService y UsersService
    authServiceMock = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'logout']);
    usersServiceMock = jasmine.createSpyObj('UsersService', ['getUserByEmail']);

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: UsersService, useValue: usersServiceMock },
        { provide: Router, useValue: {} } // Mock de Router si se necesita
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isLoggedIn and username on ngOnInit', () => {
    
    const mockUser = {
      username: 'testUser',
      email: 'test@example.com',
      password: 'password123',
      uuid: '1234-5678-9101',
      createTime: new Date().toISOString()
  };
    
    // Configurar el comportamiento del mock
    authServiceMock.isLoggedIn.and.returnValue(true);
    usersServiceMock.getUserByEmail.and.returnValue(of(mockUser));

    // Llamar al método ngOnInit
    component.ngOnInit();

    expect(component.isLoggedIn).toBeTrue();
    expect(component.username).toBe('testUser');
  });

  it('should set username to empty if user is not logged in', () => {
    authServiceMock.isLoggedIn.and.returnValue(false);

    component.ngOnInit();

    expect(component.isLoggedIn).toBeFalse();
    expect(component.username).toBe('');
  });

  it('should toggle dropdown', () => {
    component.toggleDropdown();
    expect(component.shodDropdown).toBeTrue();
    
    component.toggleDropdown();
    expect(component.shodDropdown).toBeFalse();
  });

  it('should toggle mobile menu', () => {
    component.toggleMobileMenu();
    expect(component.showMobileMenu).toBeTrue();
    
    component.toggleMobileMenu();
    expect(component.showMobileMenu).toBeFalse();
  });

  it('should call logout method from AuthService', () => {
    component.logout();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });

  it('should get user name from UsersService', () => {
    const mockUser = {
      username: 'testUser',
      email: 'test@example.com',
      password: 'password123',
      uuid: '1234-5678-9101',
      createTime: new Date().toISOString()
  };
    localStorage.setItem('usLg', 'test@example.com');
    usersServiceMock.getUserByEmail.and.returnValue(of(mockUser));

    component.getUserName();

    expect(usersServiceMock.getUserByEmail).toHaveBeenCalledWith('test@example.com');
    expect(component.username).toBe('testUser');
  });

  it('should log error if getUserByEmail fails', () => {
    localStorage.setItem('usLg', 'test@example.com');
    const consoleSpy = spyOn(console, 'log');
    usersServiceMock.getUserByEmail.and.returnValue(throwError('Error fetching user'));

    component.getUserName();

    expect(consoleSpy).toHaveBeenCalledWith('Error fetching user');
  });
});
