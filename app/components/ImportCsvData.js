// @flow
import React, { Component } from 'react';
import electron from 'electron';
import Papa from 'papaparse';

const app = electron.remote;
const dialog = app.dialog;

// const path = require('path');
const fs = require('fs');

const jsonText1 = `{
  "currency": "USD",
  "domain": "default",
  "email": "000yakinsheva@gmail.com",
  "interval": "month",
  "items": [{
    "modified": 1540385460000,
    "amount": 4567,
    "targetId": "general",
    "Type": "general"
  }],
  "salesforceId": "0036A00000MRCELQA5",
  "stripeId": "cus_CGm93PQ6fu6hd0",
  "subscriptionId": "sub_CGmEiUmcNVz0q8",
  "userId": "5a78a0a7f2450600013c6c1b"
}`;

const jsonObj1 = JSON.parse(jsonText1);

class ImportCsvData extends Component {
  state: {
    subscriptionsSeedCoData: [],
    donationServerPayloads: [],
    csvFileData: [],
    csvFileSelected: boolean,
    csvFileToProcess: string,
    combinedDataToPersist: []
  };
  constructor() {
    super();
    this.onSelectCsvFile = this.onSelectCsvFile.bind(this);
    this.onProcessCsvFile = this.onProcessCsvFile.bind(this);
    this.onProcessSubscriptionsSeedCo = this.onProcessSubscriptionsSeedCo.bind(this);
    this.state = {
      subscriptionsSeedCoData: [],
      donationServerPayloads: [],
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

  onProcessSubscriptionsSeedCo = () => {
    console.log('called onProcessCsvFile');
    const csvFileToProcess = this.state.csvFileToProcess;
    this.getDataFromSubscriptionsSeedCo(csvFileToProcess);
    console.log('end of onProcessCsvFile');
  };
  getDataFromSubscriptionsSeedCo = (fileNameWithPath) => {
    console.log('entering getDataFromCsvFile');
    console.log(`fileNamePath-->  ${fileNameWithPath}`);
    this.parseDataWithPapaParse(fileNameWithPath, this.processSubscriptionsSeedCo);
    console.log('leaving getDataFromCsvFile');
  };
  processSubscriptionsSeedCo = (data) => {
    console.log('entering processSubscriptionsSeedCo');
    // Data is usable here
    console.log('data read from papaParse...==>');
    console.log(data);
    this.setState({ subscriptionsSeedCoData: [] });
    this.setState({ subscriptionsSeedCoData: data });
    const allRecords = data.slice(1, data.length);
    const tableData = [];
    let tableRow = {};
    let jsonTextPayload = '';
    let  date = new Date();
    for (let i = 1; i < allRecords.length; i++) {
      const row = allRecords[i];
      date = new Date(row[12]);
      const timeStamp = date.getTime();
      if (row[1] !== '') {
        jsonTextPayload = `{
                "currency": "USD---need",
                "domain": "sc---need",
                "email": "${row[3]}",
                "interval": "${row[6]}",
                "items": [{
                  "modified": ${timeStamp},
                  "modifiedDate": "${date.toString()}",
                  "amount": ${row[7]},
                  "targetId": "${row[4]}",
                  "Type": "general---???Need"
                }],
                "salesforceId": "CONST--need-0036A00000MRCELQA5",
                "stripeId": "${row[1]}",
                "subscriptionId": "${row[0]}",
                "userId": "CONST--need-5a78a0a7f2450600013c6c1b"
              }`;
        tableRow = JSON.parse(jsonTextPayload);
        // console.log(tableRow);
        tableData.push(tableRow);
        console.log(`ts ====> ${date.toString()}`);
      }
    }
    console.log(`ts ====> ${date.toString()}`);
    console.log(`=====================><=============================`);
    console.log(`ts in timestamp format is ====> ${date.getTime()}`);
    console.log('leaving processSubscriptionsSeedCo');
    this.setState({ donationServerPayloads: tableData });
    console.log(`sample Donation Server payload ${jsonObj1}`);
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
    let ts = new Date();
    console.log(`newDate timestamp is====> ${ts}`);
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
        // console.log(tableRow);
        tableData.push(tableRow);
      }
    }
    console.log(`newDate timestamp is====> ${ts}`);
    console.log(`newDate timestamp is====> ${ts.toString()}`);
    ts = new Date('11/2/2018');
    console.log(`ts set to Nov 2====> ${ts.toString()}`);
    console.log(`ts in timestamp format is ====> ${ts.getTime()}`);
    ts = new Date('10/24/2018  7:51:00 AM');
    console.log(`ts set to Oct 24====> ${ts.toString()}`);
    console.log(`ts in timestamp format is ====> ${ts.getTime()}`);
    console.log(jsonObj1);
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
    const dataToSave = this.state.donationServerPayloads;
    content = JSON.stringify(dataToSave);
    dialog.showSaveDialog({ defaultPath: '~/data/donationServerPayloads.json' }, (fileName) => {
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
              <div className="panel-heading">Process data from all *.csv file</div>
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
        {/* ==================================================================================== */}
        <div className="container">
          <div className="panel panel-primary">
            {/* ================================================================================ */}
            <div className="panel panel-info">
              <div className="panel-heading">Get data from SubscriptionsSeedCo.csv</div>
              <div className="panel-body">
                <div className="btn-toolbar" role="group" aria-label="Basic example">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onSelectCsvFile}
                  >1) Select SubscriptionsSeedCo.csv</button>&nbsp;
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onProcessSubscriptionsSeedCo}
                  >2) Extract ...SubscriptionsSeedCo.csv file data
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
