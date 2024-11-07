import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { SweetAlertIcon, SweetAlertInput } from 'sweetalert2';
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  public async showAlert(config: {
    icon?: SweetAlertIcon;
    message: string;
    timer?: number;
    showCancelButton?: boolean;
    showConfirmButton?: boolean;
    title?: string;
  }) {
    return await Swal.fire({
      position: 'center',
      icon: config.icon,
      title: config.message,
      timer: config.timer,
      showCancelButton: config.showCancelButton,
      showConfirmButton: config.showConfirmButton,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
    });
  }

  public async showConfirm(config: {
    icon?: SweetAlertIcon;
    message: string;
    showCancelButton?: boolean;
    showConfirmButton?: boolean;
    title?: string;
    input: SweetAlertInput;
    inputOptions?: any;
  }) {
    return await Swal.fire({
      title: 'Confirmación',
      text: config.message,
      icon: config.icon,
      input: config.input,
      inputValue: '',
      inputOptions: config.inputOptions,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value != '') {
          return result.value;
        } else {
          return '';
        }
      } else {
        return '';
      }
    });
  }

  public async showSurvey(config: {
    icon?: SweetAlertIcon;
    message: string;
    showCancelButton?: boolean;
    showConfirmButton?: boolean;
    title?: string;
    input: SweetAlertInput;
    inputOptions?: any;
  }) {
    return await Swal.fire({
      title: 'Confirmación',
      text: config.message,
      icon: config.icon,
      input: config.input,
      inputValue: '',
      inputOptions: config.inputOptions,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value != '') {
          return result.value;
        }
      } else {
        return false;
      }
    });
  }

  public async showSimple(message: string) {
    Swal.fire(message);
  }
}
