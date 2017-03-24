/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ValuesPipe } from './app.pipe'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CsvHelper } from './app.component.csv-helper';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ValuesPipe
      ],
      imports: [
        BrowserModule,
        FormsModule,
        HttpModule
      ],
      providers: []
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render input form in a div tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div').textContent).toContain('');
  }));

  it('should create object with .setTableFromCsvData()', () => {
    const fakeCsv = "year,vendor,model,memo,price\n1997,Ford,E350,some memo,3000.00"
    const expectedObject = [{
      year: "1997",
      vendor: "Ford",
      model: "E350",
      memo: "some memo",
      price: "3000.00"
    }];
    const csvHelper = new CsvHelper();

    let result = csvHelper.setTableFromCsvData(fakeCsv, "\n");
    expect(result).toEqual(expectedObject);
  })
});
