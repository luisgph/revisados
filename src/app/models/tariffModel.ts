import { FlightInfoModel } from './flightInfoModel';
import { TaxesModel } from './taxesModel';

export class TariffModel{
    tittle : string; 
    dataFlight : Array<FlightInfoModel>; 
    dataTaxes : Array<TaxesModel>;
}
