// @flow
import React, { Component } from 'react';
import electron from 'electron';
import Papa from 'papaparse';

const app = electron.remote;
const dialog = app.dialog;

// const path = require('path');
const fs = require('fs');

class ImportCsvData extends Component {
  state: {
    csvFileData: [],
    csvFileSelected: boolean,
    csvFileToProcess: string,
    combinedDataToPersist: []
  };
  constructor() {
    super();
    this.onSelectCsvFile = this.onSelectCsvFile.bind(this);
    this.onProcessCsvFile = this.onProcessCsvFile.bind(this);
    this.state = {
      csvFileData: [],
      csvFileSelected: false,
      csvFileToProcess: 'csvFileToProcess',
      combinedDataToPersist: []
    };
  }
  onSelectCsvFile= () => {
    console.log('called onSelectCsvFile');
    const filesUserSelected = dialog.showOpenDialog(
      { title: 'Select a folder', properties: ['openFile'] }
    );
    if (filesUserSelected === undefined) {
      console.log('No file selected');
      this.setState({ csvFileSelected: false });
      this.setState({ csvFileToProcess: '' });
    } else {
      // console.log('going to set the path and boolean' + path);
      this.setState({ csvFileSelected: true });
      this.setState({ csvFileToProcess: filesUserSelected[0] });
      console.log(filesUserSelected[0]);
    }
    console.log('end of onSelectCsvFile');
  };

  parseDataWithPapaParse = (url, callBack) => {
    Papa.parse(url, {
      download: true,
      dynamicTyping: true,
      complete(results) {
        callBack(results.data);
      }
    });
  };

  onProcessCsvFile = () => {
    console.log('called onProcessCsvFile');
    const csvFileToProcess = this.state.csvFileToProcess;
    this.getDataFromCsvFile(csvFileToProcess);
    console.log('end of onProcessCsvFile');
  };

  getDataFromCsvFile = (fileNameWithPath) => {
    console.log('entering getDataFromCsvFile');
    console.log(`fileNamePath-->  ${fileNameWithPath}`);
    this.parseDataWithPapaParse(fileNameWithPath, this.doStuffCsvFile);
    console.log('leaving getDataFromCsvFile');
  };
  doStuffCsvFile = (data) => {
    console.log('entering doStuffCsvFile');
    // Data is usable here
    console.log('data read from papaParse...==>');
    console.log(data);
    this.setState({ csvFileData: [] });
    this.setState({ csvFileData: data });
    const allRecords = data.slice(1, data.length);
    const tableData = [];
    let tableRow = {};
    for (let i = 1; i < allRecords.length; i++) {
      const row = allRecords[i];
      if (row[1] !== '') {
        tableRow = {
          plan_sfid: row[4],
          customer_stid: row[1],
          customer_email: row[3],
          interval: row[6],
          status: row[8],
          metadata: { email: row[13],
            domain: row[14],
            recurringDonationId: row[15],
            userId: row[17],
            sfId: row[16] } };
        console.log(tableRow);
        tableData.push(tableRow);
      }
    }
    this.setState({ combinedDataToPersist: tableData });
    console.log('leaving doStuffCsvFile');
  };

  // onCombineDataAndSave = () => {
  //   console.log('entering onCombineDataAndSave');
  //   const csvFileDataArray = this.state.csvFileData;
  //
  //   const combinedData = [];
  //   let combinedDataOneApp = {};
  //   let csvFileDataData = '';
  //
  //   let i = 0;
  //   for (i = 0; i < csvFileDataArray.length; i++) {
  //     csvFileDataData = csvFileDataArray[i].osVersionData;
  //     combinedDataOneApp = {
  //       osversionData: csvFileDataData
  //     };
  //     // console.log(combinedDataOneApp);
  //     combinedData.push(combinedDataOneApp);
  //   }
  //   this.setState({ combinedDataToPersist: combinedData });
  //   console.log('leaving onCombineDataAndSave');
  // };

  onSaveAllAppsDataToFile = () => {
    const jsonData = [
      {
        osVersion: 'Android R2D2',
        installs: 16,
        active: 11
      },
      {
        osVersion: 'Android RP3',
        installs: 16345959,
        active: 1
      }];
    let content = JSON.stringify(jsonData);
    // You can obviously give a direct path without use the dialog
    // (C:/Program Files/path/myfileexample.txt)
    const dataToSave = this.state.combinedDataToPersist;
    content = JSON.stringify(dataToSave);
    dialog.showSaveDialog({ defaultPath: '~/data/mogoData.json' }, (fileName) => {
      console.log(`fileName is ==> ${fileName}`);
      if (fileName === undefined) {
        console.log("You didn't save the file");
        return;
      }
        // fileName is a string that contains the path and filename created in the save file dialog.
      fs.writeFile(fileName, content, (err) => {
        if (err) {
          alert(`An error ocurred creating the file ${err.message}`);
        }
        alert('The file has been succesfully saved');
      });
    });
  };

  render() {
    const jsonDataFile = 'jsonDataFile';
    return (
      <div className="container">
        {/* ==================================================================================== */}
        <div className="container">
          <div className="panel panel-primary">
            {/* ================================================================================ */}
            <div className="panel panel-info">
              <div className="panel-heading">Process data from all osversion.csv files</div>
              <div className="panel-body">
                <div className="btn-toolbar" role="group" aria-label="Basic example">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onSelectCsvFile}
                  >1) Select csv file to process</button>&nbsp;
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onProcessCsvFile}
                  >2) Extract ...*.csv file data
                  </button>&nbsp;
                </div>
              </div>
            </div> {/* panel-info */}
            {/* ================================================================================ */}
          </div>
        </div>
        {/* =================================================================================== */}
        <div className="container">
          <div className="panel panel-primary">
            {/* ================================================================================ */}
            <div className="panel panel-info">
              <div className="panel-heading">Combine Data for All Apps and Save as Json file</div>
              <div className="panel-body">
                <div className="btn-toolbar" role="group" aria-label="Basic example">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onSaveAllAppsDataToFile}
                  >Save As...</button>&nbsp;
                </div>
                <br />
                <div className="form-group">
                  <label className="col-sm-2 control-label" htmlFor="jsonDataFile">Data Saved As: </label>
                  <div className="form-text" id="jsonDataFile" placeholder="jsonDataFile" >{jsonDataFile}</div>
                </div> {/* form-group */}
              </div>
            </div> {/* panel-info */}
            {/* =============================================================================== */}
          </div>
        </div>
        {/* ==================================================================================== */}

      </div>
    );
  }
}

export default ImportCsvData;
