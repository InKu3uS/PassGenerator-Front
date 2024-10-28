import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateComparer'
})
export class DateComparerPipe implements PipeTransform {

  /**
   * Compara dos fechas y devuelve la diferencia en dias entre ambas.
   * @param actualDate fecha actual
   * @param expirationDate fecha de expiracion de la contraseña
   * @returns Diferencia en dias de ambas fechas
   */
  transform(actualDate: string, expirationDate:string): number {
    
    const parseDate1 = this.parseDate(expirationDate);
    const parseDate2 = this.parseDate(actualDate);

    const timeDiff = parseDate1.getTime() - parseDate2.getTime();

    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  }

  parseDate(date:string): Date {
    const [day, month, year] = date.split('/').map(Number);
    return new Date(year, month -1, day);
  }
}
