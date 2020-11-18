import { Component, OnInit } from '@angular/core';
import { AlertService } from '../alert/alert.service';
import { ServerInfoResponse } from '../server-info-response';
import { VersionService } from '../version.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.sass']
})
export class AboutComponent implements OnInit {

  uiVersion: string;
  uiBuildDate: Date;
  uiGitHash: string;

  serverVersion: string;
  serverBuildDate: Date;
  serverGitHash: string;
  serverGitHashFull: string;

  constructor(
    private alertService: AlertService,
    private versionService: VersionService
  ) { }

  ngOnInit(): void {

    // UI
    const uiInfo: any = this.versionService.getUiInfo();
    this.uiVersion = uiInfo.version;
    this.uiBuildDate = uiInfo.buildDate;
    this.uiGitHash = uiInfo.hash;

    // Server
    this.versionService.getServerInfo()
      .subscribe(
        (response: ServerInfoResponse) => {
          this.serverVersion = response.version;
          this.serverBuildDate = response.buildDate;
          this.serverGitHash = response.gitHash;
          this.serverGitHashFull = response.gitHashFull;
        },
        error => this.alertService.error(error)
      );

  }

}
