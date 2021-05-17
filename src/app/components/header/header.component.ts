import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit
{
  public constructor(
    private _router: Router)
  {
    console.log("Header.component - ctor");
  }

  public ngOnInit(): void
  {
  }

  public onClick_Header(): void
  {
    this._router.navigate(['']); // navigate to homepage
  }
}
