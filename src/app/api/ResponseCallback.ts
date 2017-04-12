import { Response } from '@angular/http';

/**
 * Interfaz que implementan los callbacks que manejan los
 * response de la API
 */
export interface ResponseCallback
{
    (response: Response): any;
}
