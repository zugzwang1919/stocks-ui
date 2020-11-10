import { Component, OnInit } from '@angular/core';
import { AlertService } from '../alert/alert.service';
import { ServerInfoResponse } from '../server-info-response';
import { VersionService } from '../version.service';
import { versionInfo } from 'version-info';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.sass']
})
export class AboutComponent implements OnInit {

  uiVersion = versionInfo.version;
  uiBuildDate = versionInfo.buildDate;
  uiGitHash = versionInfo.hash;

  serverVersion: string;
  serverBuildDate: Date;
  serverGitHash: string;
  serverGitHashFull: string;

  constructor(
    private alertService: AlertService,
    private versionService: VersionService
  ) { }

  ngOnInit(): void {

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
