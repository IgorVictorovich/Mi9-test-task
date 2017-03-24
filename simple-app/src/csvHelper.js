function CsvHelper() {
  const CELLS_SPLIT = ",";
  const ROWS_SPLIT = ";";
  const TABLE_ID = "tableDiv";
  const SORT_ORDER = {
    ASC: "ASC",
    DESC: "DESC"
  };

  let _sortedFields = {};
  let _jsonData = null;

  function isValidDate(value) {
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

  function toggleSort(sortOrder) {
    return sortOrder === SORT_ORDER.DESC
      ? SORT_ORDER.ASC
      : SORT_ORDER.DESC;
  }

  function sortBy(arrayOfObjects, sortBy, sortOrder, sortFunc) {
    const defaultSortFunc = function(a, b) {

  		let f1 = a[sortBy];
  		let f2 = b[sortBy];


      if (sortOrder === SORT_ORDER.DESC) {
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

  function onSortClick(event) {
    let sortOrder = SORT_ORDER.ASC;

    if (!event) {
      return;
    }

    let id = event.target.id;

    if (_sortedFields.hasOwnProperty(id)) {
      sortOrder = toggleSort(_sortedFields[id]);
      _sortedFields[id] = sortOrder;
    } else {
      _sortedFields[id] = sortOrder;
    }

    let sortedData = sortBy(_jsonData, id, sortOrder);

    createTable(sortedData, TABLE_ID);
  }

  function getArrayFromCsv(csvText, newLineSymbol) {
    newLineSymbol = newLineSymbol || ROWS_SPLIT;
    return csvText.split(newLineSymbol);
  }

  function getJsonFromCsvArray(array, delimiter) {
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
          let valueDate = isValidDate(row[i]);
          obj[title[i]] = valueDate || row[i];
  			}
  		}
  		data.push(obj);
  	}

  	return data;
  }

  function getTableParameters(data) {
    let rows = data.length;
    let cells = Object.keys(data[0]).length;

    return {
      Rows: rows,
      Cells: cells
    };
  }

  function reCreateTable(tableId) {
    let tableDiv = document.getElementById(tableId);
    if (tableDiv && tableDiv.hasChildNodes("table")) {
      while (document.getElementById(tableId)) {
        document.body.removeChild(document.getElementById(tableId));
      }
      let div = document.createElement('DIV');
      div.id = TABLE_ID;
      document.body.appendChild(div);

      tableDiv = div;
    }
    return tableDiv;
  }

  function createTable(data, tableId) {
    let parameters = getTableParameters(data);

    let tableDiv = reCreateTable(tableId);

    let table = document.createElement('TABLE');
    table.border = '1';

    let tableHead = document.createElement('thead');
    table.appendChild(tableHead);

    let tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    //create title

    let titleTr = document.createElement('TR');
    tableHead.appendChild(titleTr);

    for (let t = 0; t < parameters.Cells; t++) {
      let titleTh = document.createElement('TH');
      titleTh.width = '75';

      let firstRow = data[0];
      let titleKeys = Object.keys(firstRow);
      titleTh.id = titleKeys[t];
      titleTh.onclick = onSortClick;
      titleTh.appendChild(document.createTextNode(titleKeys[t]));
      titleTr.appendChild(titleTh);
    }

    for (let i = 0; i < parameters.Rows; i++) {
        let tr = document.createElement('TR');
        tableBody.appendChild(tr);
        for (let j = 0; j < parameters.Cells; j++) {
            let td = document.createElement('TD');
            td.width = '75';
            td.appendChild(document.createTextNode(data[i][Object.keys(data[i])[j]]));
            tr.appendChild(td);
        }
    }
    tableDiv.appendChild(table);
  }

  function setTableFromCsvData(csvData, newLineSymbol) {
    if (!_jsonData) {
        let dataArray = getArrayFromCsv(csvData, newLineSymbol);
        _jsonData = getJsonFromCsvArray(dataArray);
    }
    createTable(_jsonData, TABLE_ID);
  }

  return { setTableFromCsvData: setTableFromCsvData };
}
