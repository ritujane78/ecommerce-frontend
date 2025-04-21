import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  private countriesURL = environment.ecommerceApiUrl + '/countries';
  private statesURL = environment.ecommerceApiUrl + 'states';

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]>{
    return this.httpClient.get<getResponseCountries>(this.countriesURL).pipe(
      map(response => response._embedded.countries )
    );
  }

  getStates(theCountryCode: string): Observable<State[]>{
    const searchStatesURL = `${this.statesURL}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<getResponsesStates>(searchStatesURL).pipe(
      map(response => response._embedded.states)
    )

  }

  creditCardMonths(startMonth: number):Observable<number[]>{


    let data: number[] = [];

    for(let theMonth = startMonth; theMonth <=12; theMonth++){
      data.push(theMonth);
    }
    return of(data);
  }

  getCreditCardYear(): Observable<number[]>{
    let data : number[] = [];
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }
    return of(data);
  }
}

interface getResponseCountries{
  _embedded: {
    countries: Country[];
  }
}
interface getResponsesStates{
  _embedded: {
    states: State[];
  }
}
