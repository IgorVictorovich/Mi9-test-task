const CELLS_SPLIT = ",";
const ROWS_SPLIT = ";";
const TABLE_ID = "tableDiv";
enum SortOrder { ASC, DESC };

export class CsvHelper {
  private _sortedFields: any = {};
  private _jsonData: Array<any>;

  private toggleSort(sortOrder): SortOrder {
    return sortOrder === SortOrder.DESC
      ? SortOrder.ASC
      : SortOrder.DESC;
  }

  private sortBy(arrayOfObjects: Array<any>, sortBy: string, sortOrder: SortOrder, sortFunc?: any) : Array<any> {

    const defaultSortFunc = function(a, b) {

  		let f1 = a[sortBy];
  		let f2 = b[sortBy];

      if (sortOrder === SortOrder.DESC) {
        let s1 = f1;
        let s2 = f2;
        f1 = s2;
        f2 = s1;
      }

	    let x = f1 instanceof Date ? f1 : f1.toLowerCase();
	    let y = f2 instanceof Date ? f2 : f2.toLowerCase();

	    return x < y ? -1 : x > y ? 1 : 0;
  	}

    sortFunc = sortFunc || defaultSortFunc;
  	let data = arrayOfObjects.slice(0);

  	return data.sort(sortFunc);
  }

  private isValidDate(value: string): any {
    if (value.length < 8) {
    	return false;
    }
    let timestamp = Date.parse(value)

    if (isNaN(timestamp)==false)
    {
        return new Date(timestamp);
    }
    return false;
  }

  public getSortedTable(data, field): Array<any> {
    let sortOrder = SortOrder.ASC;

    if (!field) {
      return;
    }

    if (this._sortedFields.hasOwnProperty(field)) {
      sortOrder = this.toggleSort(this._sortedFields[field]);
      this._sortedFields[field] = sortOrder;
    } else {
      this._sortedFields[field] = sortOrder;
    }

    return this.sortBy(data, field, sortOrder);
  }

  private getArrayFromCsv(csvText: string, newLineSymbol: string): Array<any> {
    newLineSymbol = newLineSymbol || ROWS_SPLIT;
    return csvText.split(newLineSymbol);
  }

  private getJsonFromCsvArray(array: Array<any>, delimiter?: string): Array<any> {
  	delimiter = delimiter || CELLS_SPLIT;
  	let title = array[0].split(delimiter);

  	let data = [];
  	let dataArray = [];

  	for(let d = 1; d<array.length; d++) {
  		dataArray.push(array[d]);
  	}

  	for (let a = 0; a < dataArray.length; a++) {
  		let obj = {};
  		for(let i = 0; i < title.length; i++) {
  			if (dataArray[a]) {
  				let row = dataArray[a].split(delimiter);
          let valueDate = this.isValidDate(row[i]);
  				obj[title[i]] = valueDate || row[i];
  			}
  		}
  		data.push(obj);
  	}

  	return data;
  }

  public setTableFromCsvData(csvData, newLineSymbol): Array<any> {
    let dataArray = this.getArrayFromCsv(csvData, newLineSymbol);
    this._jsonData = this.getJsonFromCsvArray(dataArray);
    return this._jsonData;
  }

}
