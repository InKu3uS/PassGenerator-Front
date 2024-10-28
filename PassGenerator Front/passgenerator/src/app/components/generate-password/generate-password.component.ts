import { Component, inject } from '@angular/core';
import { AccountsService } from '../../services/accounts/accounts.service';
import { Router } from '@angular/router';
import { SwalService } from '../../services/swal/swal.service';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'generate-password',
  templateUrl: './generate-password.component.html',
  styleUrl: './generate-password.component.css'
})
export class GeneratePasswordComponent {

  passwordLength: number = 25;

  private sharedService = inject(SharedService);
  private router = inject(Router);
  private swal = inject(SwalService);

  /**
   * Obtiene el valor del slide '#length-range' y lo guarda el 'passwordLength'.
   */
  GetRangeValue(){
    let actualLength = document.querySelector('#length-range') as HTMLInputElement;
    this.passwordLength = parseInt(actualLength.value);
  }


  /**
   * Incrementa el valor del slide '#length-range' en 1 actualiza 'passwordLength'
   */
  increaseRange(){
    let actualLength = document.querySelector('#length-range') as HTMLInputElement;
    this.passwordLength++;
    actualLength.value = this.passwordLength.toString();
  }

  /**
   * Reduce el valor del slide '#length-range' en 1 actualiza 'passwordLength'
   */
  decreaseRange(){
    let actualLength = document.querySelector('#length-range') as HTMLInputElement;
    this.passwordLength--;
    actualLength.value = this.passwordLength.toString();
  }

  /**
   * Copia la contraseña contenida en el span '#generatedPassword' al portapapeles
   */
  copyToClipboard(){
    let copyText = (document.getElementById("generatedPassword") as HTMLSpanElement).textContent;
    if(copyText !== null) {
      navigator.clipboard.writeText(copyText);
    this.swal.copyToClipBoard();
    }
  }

  /**
   * Genera un String base de para la generación de la contraseña.
   * La base contendrá los tipos de caracteres que se hayan marcado en los checkbox correspondientes.
   * Se excluiran los caracteres que el usuario haya indicado en el input text 'excludeCharacters'.
   * Si hay caracteres que excluir envía la base a 'generatePassword' pasando como parametro el resultado de 'excludeChars'.
   * Si no hay caracteres que excluir, se envia a 'generatePassword' la base y la longitud del password a generar.
   */
  generateBase() {

    let exclude = (document.getElementById('excludeCharacters') as HTMLInputElement).value;
    
    let lowerCheck = (document.getElementById('lowerCheck') as HTMLInputElement);
    let upperCheck = (document.getElementById('upperCheck') as HTMLInputElement);
    let numbersCheck = (document.getElementById('numbersCheck') as HTMLInputElement);
    let simbolsCheck = (document.getElementById('simbolsCheck') as HTMLInputElement);

    let generatedPassword = document.getElementById('generatedPassword') as HTMLSpanElement;

    let length = this.passwordLength;
    let base = "";
    let lower = "abcdefghijklmnopqrstuvwxyz";
    let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let numbers = "0123456789";
    let symbols = ".?,;-_!¡¿*%&$/()[]{}|@<>#= ";


    if (lowerCheck.checked) base += lower;
    if(upperCheck.checked) base += upper;
    if (numbersCheck.checked) base += numbers;
    if (simbolsCheck.checked) base += symbols;



    if (exclude.length > 0) {
        generatedPassword.textContent = this.generatePassword(this.excludeChars(base, exclude), length);
    } else {
        generatedPassword.textContent = this.generatePassword(base, length);
    }
  }

  /**
 * La función `excludeChars` toma una cadena base y una cadena de exclusión como entrada, y devuelve la
 * cadena base con todos los caracteres de la cadena de exclusión eliminados.
 * @param base - El parámetro "base" es una cadena que representa la cadena base de la cual se
 * excluirán los caracteres.
 * @param exclude - El parámetro "exclude" es una cadena que contiene los caracteres que desea excluir
 * de la cadena "base".
 * @returns La función "excludeChars" devuelve la cadena "base" modificada después de eliminar todos
 * los caracteres especificados en la cadena "exclude".
 */
excludeChars(base:string, exclude:string) {
  for (let i = 0; i < exclude.length; i++) {
      base = base.replaceAll(exclude.charAt(i), "");
  }
  return base;
}

  /**
 * La función genera una contraseña aleatoria de una longitud especificada utilizando caracteres de una
 * cadena base determinada.
 * @param base - El parámetro "base" es una cadena que representa los caracteres que se pueden utilizar
 * para generar la contraseña.
 * @param length - El parámetro de longitud especifica la longitud deseada de la contraseña generada.
 * @returns una contraseña generada aleatoriamente de la longitud especificada, utilizando caracteres
 * de la cadena base proporcionada.
 */
  generatePassword(base:string, length:number) {
    let password = "";

    for (let i = 0; i < length; i++) {
        let random = Math.floor(Math.random() * base.length);
        password += base.charAt(random);
    }
    this.passwordTest(password);
    return password;
  }

  /**
   * Evalua la contraseña generada, muestra la contraseña y un texto dependiendo de la complejidad
   * de la contraseña en el HTML
   * @param password - contraseña generada
   * @returns 
   */
  passwordTest(password:string) {
    let passwordResult = document.getElementById('passwordResult') as HTMLSpanElement;
    let showPassword = document.getElementById('showPassword') as HTMLDivElement;

    let generatedPassword = document.getElementById('generatedPassword') as HTMLSpanElement;
    let buttons = document.getElementById('buttons') as HTMLDivElement;

    generatedPassword.classList.remove('hidden');
    buttons.classList.remove("hidden");
    buttons.classList.add('flex');

    let message = "Esta contraseña es segura";
    
    if (password.length === 0) {
        passwordResult.className = "bg-red-600 p-2 rounded font-semibold";
        passwordResult.textContent = "Asegurate de que has marcado al menos un tipo de caracter";
        showPassword.classList.remove("hidden");
        showPassword.classList.add("flex");
        generatedPassword.classList.add('hidden');
        buttons.classList.add('hidden');
        return;
    }
    if (password.length <= 8) {
        message = "Una contraseña de 8 caracteres o menos puede romperse en menos de 8 horas";
        passwordResult.className = "bg-yellow-500 p-2 rounded font-semibold";
        passwordResult.textContent = message;
        showPassword.classList.remove("hidden");
        showPassword.classList.add("flex");
    }
    if (password.length > 8 && password.length <= 16) {

        passwordResult.className = "bg-yellow-500 p-2 rounded font-semibold";
        showPassword.classList.remove("hidden");
        showPassword.classList.add("flex");

        if (!password.match(/[?.,;\-_!¡¿*%&$/()[\]{}|@<>#=]/g) || !password.match(/\d/g) || !password.match(/\d/g)) {
            message = "Una contraseña entre de entre 9 y 16 caracteres debe contener minúsculas, mayúsculas, números y simbolos";
        } else {
            passwordResult.className = "bg-green-600 p-2 rounded font-semibold";
        }
        passwordResult.textContent = message;
        showPassword.classList.remove("hidden");
        showPassword.classList.add("flex");
    }
    if (password.length > 16) {
        passwordResult.className = "bg-green-600 p-2 rounded font-semibold";
        passwordResult.textContent = message;
        showPassword.classList.remove("hidden");
        showPassword.classList.add("flex");
    }
  }

  savePassword(){
    let generatedPassword = document.getElementById('generatedPassword') as HTMLSpanElement;
    if(generatedPassword.textContent != null) {
      this.sharedService.savePassword(generatedPassword.textContent);
      this.router.navigate(['/save']);
    }
  }
}
