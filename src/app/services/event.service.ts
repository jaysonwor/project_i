import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private formRefreshAnnouncedSource = new Subject();
  formRefreshSource$ = this.formRefreshAnnouncedSource.asObservable();

  constructor() { }

  publishFormRefresh(){
    this.formRefreshAnnouncedSource.next()
  }
}
