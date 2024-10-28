import { AbstractControl } from "@angular/forms";

export function ValidateDate(control: AbstractControl) {
    const currentDate = new Date().setHours(0, 0, 0, 0);
    const inputDate = new Date(control.value).setHours(0, 0, 0, 0);

    if (inputDate < currentDate) {
        return { dateInvalid: true };
    }
    return null;
}