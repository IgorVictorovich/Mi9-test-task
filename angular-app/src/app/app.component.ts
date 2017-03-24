import { Component, Input } from '@angular/core';
import { CsvHelper } from './app.component.csv-helper'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  @Input() public csvText: string;
  csvHelper: any = new CsvHelper();
  tableData: Array<any> = [];
  titleList: Array<string>;

  onClick() {
    this.tableData = this.csvHelper.setTableFromCsvData(this.csvText, "\n");
    this.titleList = this.getKeys(this.tableData);
  }

  onTableClick(field) {
    this.tableData = this.csvHelper.getSortedTable(this.tableData, field)
  }

  private getKeys(array: Array<any>): Array<string> {
    return Object.keys(array[0]);
  }
}
