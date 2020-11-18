import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WolfeHttpService } from '../wolfe-common/wolfe-http.service';
import { ServerInfoResponse } from './server-info-response';
declare var require: any;

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  constructor(
    private wolfeHttpService: WolfeHttpService
  ) { }

  getUiInfo(): any {
    try {
      return require('/git-version.json');

    } catch {
      // In dev the file might not exist:
      return {  version: '0.0.0',
                buildDate: new Date('1/1/1900'),
                hash: 'dev' };
    }
  }

  getServerInfo(): Observable<ServerInfoResponse> {
    return this.wolfeHttpService.get('/version');
  }
}
