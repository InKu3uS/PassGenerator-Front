import { Component, inject, Input, OnInit } from '@angular/core';
import { AccountsService } from '../../services/accounts/accounts.service';
import { UsersService } from '../../services/users/users.service';
import { User } from '../../model/UserSchema';
import { createCuenta, Cuenta } from '../../model/cuentaSchema';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SwalService } from '../../services/swal/swal.service';
import { SharedService } from '../../services/shared/shared.service';
import { ValidateDate } from '../../validators/date.validator';

@Component({
  selector: 'app-save-password',
  templateUrl: './save-password.component.html',
  styleUrl: './save-password.component.css'
})
export class SavePasswordComponent implements OnInit {

  user: User | undefined;
  private service = inject(AccountsService);
  private sharedService = inject(SharedService);
  private userService = inject(UsersService);
  private swal = inject(SwalService);

  password: string = "";
  site: string = "";
  updateAccount: boolean = false;
  minDate: string = "";

  cuentaForm: FormGroup = new FormGroup({
    site: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
    expiration: new FormControl(null, [Validators.required, ValidateDate])
  });
  
  cuenta = createCuenta;

  ngOnInit(): void {
    if(this.sharedService.getPassword() !== ""){
      this.password = this.sharedService.getPassword();
      this.existsPassword();
    }
    if(this.sharedService.getSite() !== ""){
      this.site = this.sharedService.getSite();
      this.existsSite();
    }
    this.getUserLogged();
    this.showDate();
  }

  existsPassword(){
    this.cuentaForm.get('password')?.setValue(this.password);
    this.cuentaForm.get('password')?.disable();
  }

  existsSite(){
    this.cuentaForm.get('site')?.setValue(this.site);
    this.cuentaForm.get('site')?.disable();
    this.updateAccount = true;
  }

  getUserLogged(){
    let mail = localStorage.getItem('usLg');
    if(mail != null){
      this.userService.getUserByEmail(mail).subscribe({
        next: (user) => {
          this.user = user;
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  showDate(){
    let date = new Date().toISOString();
    this.minDate = date.split('T')[0];
  }

  saveAccount(){
    let site = this.cuentaForm.get('site')?.value;
    let password = this.cuentaForm.get('password')?.value;
    let expiration = this.cuentaForm.get('expiration')?.value;
    
    if(expiration){
      expiration = expiration.split('-').reverse().join('/');
    }
    
    let cuenta: Cuenta = {
      user:{
        uuid: this.user?.uuid ?? ""
      },
      createTime: new Date().toISOString(),
      expirationTime: expiration,
      site: site,
      password: password
    };

    const validationResult = createCuenta.safeParse(cuenta);
    if (!validationResult.success) {
        console.error("Validation error:", validationResult.error);
        return;
    }

    if (!this.updateAccount){
      this.service.save(cuenta).subscribe({
        next: (response) => {
          this.cuentaForm.reset();
          this.swal.savedAccount(site);
          this.sharedService.resetPassword();
          this.sharedService.resetSite();
        },
        error: (error) => {
          this.swal.duplicateAccount(error);
        }
      });
    }

    if(this.updateAccount){
      this.service.update(cuenta).subscribe({
        next: (response) => {
          this.cuentaForm.reset();
          this.swal.updatedAccount(site);
          this.sharedService.resetPassword();
          this.sharedService.resetSite();
        },
        error: (error) => {
          this.swal.duplicateAccount(error);
        }
      })
    }
    
  }
}
