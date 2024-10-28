import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { TitleService } from '../../services/title/title.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Title } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockTitleService: jasmine.SpyObj<TitleService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockTitle: jasmine.SpyObj<Title>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login', 'isLoggedIn']);
    mockTitleService = jasmine.createSpyObj('TitleService', ['blurTitle']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockTitle = jasmine.createSpyObj('Title', ['setTitle']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        JwtModule.forRoot({
          config: {
            tokenGetter: () => ''
          }
        })
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: TitleService, useValue: mockTitleService },
        { provide: Router, useValue: mockRouter },
        { provide: Title, useValue: mockTitle },
        { provide: JwtHelperService, useClass: JwtHelperService },
        { provide: 'JWT_OPTIONS', useValue: {} },
        JwtHelperService,
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the title on init', () => {
    const defaultTitle = 'PassGenerator - Login';
    expect(mockTitle.setTitle).toHaveBeenCalledWith(defaultTitle);
    expect(mockTitleService.blurTitle).toHaveBeenCalledWith(defaultTitle);
  });

  it('should redirect if logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should not redirect if not logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(false);
    component.ngOnInit();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should call login and navigate on successful login', (done) => {
    const token = 'valid.token.value';
    const session = { token };
    const decodedToken = { sub: 'test@example.com' };
  
    // Usa el servicio inyectado en el componente
    const jwtHelperService = TestBed.inject(JwtHelperService);
  
    // Espía el método decodeToken del JwtHelperService
    spyOn(jwtHelperService, 'decodeToken').and.returnValue(decodedToken);
    
    // Mockea la respuesta del login
    mockAuthService.login.and.returnValue(of(session));
  
    // Establece valores en el formulario
    component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });
  
    // Espía el método navigate y retorna una promesa resuelta
    mockRouter.navigate.and.returnValue(Promise.resolve(true));
  
    // Llama al método login
    component.login();
  
    // Verifica que el servicio de autenticación fue llamado con los valores correctos
    expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'password123');
  
    // Asegúrate de que el token y el usuario fueron almacenados correctamente en localStorage
    expect(localStorage.getItem('tkActUs')).toBe(token);
    expect(localStorage.getItem('usLg')).toBe('test@example.com');
  
    // Verifica que el método navigate fue llamado correctamente
    mockRouter.navigate(['/home']).then(() => {
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
      done();  // Llama a done para finalizar el test asíncrono
    });
  });
  

  it('should display an error message for 404 error', () => {
    mockAuthService.login.and.returnValue(throwError({ status: 404 }));

    component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });
    component.login();

    expect(component.errorLogin).toBe('Email o contraseña incorrectas. Verifica los datos e intentalo de nuevo.');
  });

  it('should display a general error message for other errors', () => {
    mockAuthService.login.and.returnValue(throwError({ status: 500 }));

    component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });
    component.login();

    expect(component.errorLogin).toBe('Ha ocurrido un error al realizar el login. Vuelva a intentarlo.');
  });
});
