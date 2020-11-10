import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WolfeHttpService } from '../wolfe-common/wolfe-http.service';
import { ServerInfoResponse } from './server-info-response';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  constructor(
    private wolfeHttpService: WolfeHttpService
  ) { }

  getServerInfo(): Observable<ServerInfoResponse> {
    return this.wolfeHttpService.get('/version');
  }
}
