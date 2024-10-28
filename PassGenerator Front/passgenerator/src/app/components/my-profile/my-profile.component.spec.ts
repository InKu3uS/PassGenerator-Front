import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyProfileComponent } from './my-profile.component';
import { of, throwError } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { UsersService } from '../../services/users/users.service';
import { AccountsService } from '../../services/accounts/accounts.service';
import { TitleService } from '../../services/title/title.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';

describe('MyProfileComponent', () => {
  let component: MyProfileComponent;
  let fixture: ComponentFixture<MyProfileComponent>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockAccountsService: jasmine.SpyObj<AccountsService>;
  let mockTitleService: jasmine.SpyObj<TitleService>;
  let mockTitle: jasmine.SpyObj<Title>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockUsersService = jasmine.createSpyObj('UsersService', ['getUserByEmail', 'editUsername']);
    mockAccountsService = jasmine.createSpyObj('AccountsService', ['countAllAccountsByEmail']);
    mockTitleService = jasmine.createSpyObj('TitleService', ['blurTitle']);
    mockTitle = jasmine.createSpyObj('Title', ['setTitle', 'getTitle']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    // Simular el retorno esperado
    mockTitle.getTitle.and.returnValue('PassGenerator - Mi Perfil');
    mockAccountsService.countAllAccountsByEmail.and.returnValue(of(5));

    TestBed.configureTestingModule({
      declarations: [MyProfileComponent],
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: AccountsService, useValue: mockAccountsService },
        { provide: TitleService, useValue: mockTitleService },
        { provide: Title, useValue: mockTitle },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should set default title on init', () => {
    const mockUser = { email: 'test@example.com', username: 'testUser', password: 'testPassword' };
    localStorage.setItem('usLg', mockUser.email);

    mockUsersService.getUserByEmail.and.returnValue(of(mockUser));
    mockAccountsService.countAllAccountsByEmail.and.returnValue(of(5));

    component.ngOnInit();

    // Verificaciones
    expect(mockTitle.setTitle).toHaveBeenCalledWith(component.defaultTitle);
    expect(mockTitle.getTitle()).toEqual('PassGenerator - Mi Perfil'); // Llama al método
    expect(mockTitleService.blurTitle).toHaveBeenCalledWith(component.defaultTitle);
  });

  it('should call UsersService and AccountsService on init', () => {
    const mockUser = { email: 'test@example.com', username: 'testUser', password: 'testPassword' };
    localStorage.setItem('usLg', mockUser.email);

    mockUsersService.getUserByEmail.and.returnValue(of(mockUser));
    mockAccountsService.countAllAccountsByEmail.and.returnValue(of(5));

    component.ngOnInit();

    expect(mockUsersService.getUserByEmail).toHaveBeenCalledWith(mockUser.email);
    expect(mockAccountsService.countAllAccountsByEmail).toHaveBeenCalledWith(mockUser.email);
  });

  it('should handle user not found case', () => {
    localStorage.removeItem('usLg');

    component.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should update user profile successfully', () => {
    const mockUser = { email: 'test@example.com', username: 'testUser', password: 'testPassword' };
    component.user = mockUser;

    // Simulamos el valor del nuevo nombre de usuario en el formulario
    component.usernameForm.get('username')?.setValue('newTestUser');

    // Simular el retorno esperado del servicio `editUsername`
    mockUsersService.editUsername.and.returnValue(of(mockUser)); // Simula una respuesta exitosa

    component.changeUsername();

    expect(mockUsersService.editUsername).toHaveBeenCalledWith(component.emailLoggedIn, 'newTestUser');
  });
});
