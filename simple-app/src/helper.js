"use strict";

function createTable() {
  let csvHelper = CsvHelper();

  let csvText = document.getElementById("csvText");

  let csv = csvText ? csvText.value : "";

  csvHelper.setTableFromCsvData(csv, "\n");
}
