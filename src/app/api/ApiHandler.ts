import {  Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { ResponseCallback } from './ResponseCallback';

/**
 * Manejadores genéricos de la API 
 */
export class ApiHandler
{

  constructor()
  {
    //
  }

  /**
   * Manejador genérico del objeto Observable<Response> de los request de la API
   *
   * Establece los manejadores genéricos para success y error, que luego delegan el manejo a
   * los callables provistos por el usuario.
   */
  public genericHandleResponse(observable: Observable<Response>,
                               userSuccessHandler: ResponseCallback,
                               userErrorHandler: ResponseCallback
                              ): any
  {

    return observable.catch(this.handleErrorResponse(userErrorHandler))
                     .subscribe(this.handleSuccessResponse(userSuccessHandler))
                     ;
  }


  /**
   * Devuelve un callback para manejar los success de la API
   * 
   * Maneja la estructura superior de la API y delega la llamada al callback
   * provisto por el usuario.
   */
  private handleSuccessResponse(userSuccessHandler: ResponseCallback): any
  {
    return function (response: Response) {
      console.debug('API.success', response);
        let data = response.json();


        userSuccessHandler(data.data);
    };
  }


  /**
   * Devuelve un callback para manejar los errors de la API
   * 
   * Maneja los casos especiales de errores de la API, y si correspode
   * delega la llamada al manejador provisto por el usuario.
   */
  private handleErrorResponse (errorErrorHandler?: ResponseCallback)
  {
    return function (response: Response) {

      console.debug('API.error(' + response.status + ',' + response.statusText + ')', response);

      if (!this.handleApiErrors(response)) {
        return;
      }

      if (errorErrorHandler) {
        errorErrorHandler(response);
      }
    }.bind(this);
  }

  /**
   * Maneja los errores comunes de la API
   * 
   * Devuelve true si puede delegarse el error al usuario o false en caso contrario 
   */
  private handleApiErrors(error: Response): boolean
  {
    console.log('error', error, error.json());
    // TODO error 0 cuando no tiene sesion
    switch (error.status) {
      case 401:
        window.location.href = error.json().login_url;
        return false;
      case 0:
        console.log('error 0')
        return false;

    }
    return true;
  }
}
