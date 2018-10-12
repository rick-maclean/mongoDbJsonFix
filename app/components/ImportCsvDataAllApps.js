// @flow
import React, { Component } from 'react';
import electron from 'electron';
import Papa from 'papaparse';

const app = electron.remote;
const dialog = app.dialog;
const countriesIso = require('i18n-iso-countries');
const gplay = require('google-play-scraper');

const path = require('path');
const fs = require('fs');

class ImportCsvDataAllApps extends Component {
  state: {
    overviewDataAllApps: [],
    countryDataAllApps: [],
    osversionDataAllApps: [],

    appsFolderSelected: boolean,
    appsFolder: string,

    listOfAppTitles: [],
    titleFromScraperApp: string,
    totalNumberOfWBTApps: string,
    numberOfAppTitlesProcessed: string,

    combinedDataToPersist: []

  };
  constructor() {
    super();
    this.onSelectAppsFolder = this.onSelectAppsFolder.bind(this);
    this.onProcessAllCountryFilesInFolder = this.onProcessAllCountryFilesInFolder.bind(this);
    this.onProcessAllOverviewFilesInFolder = this.onProcessAllOverviewFilesInFolder.bind(this);
    this.onProcessAllOSversionFilesInFolder = this.onProcessAllOSversionFilesInFolder.bind(this);
    this.savePackageTitlesToArray = this.savePackageTitlesToArray.bind(this);
    this.state = {
      overviewDataAllApps: [],
      countryDataAllApps: [],
      osversionDataAllApps: [],

      appsFolderSelected: false,
      appsFolder: 'appsFolder',

      listOfAppTitles: [],
      titleFromScraperApp: '',
      totalNumberOfWBTApps: 'no count yet',
      numberOfAppTitlesProcessed: 'none yet',

      combinedDataToPersist: []
    };
  };
  onSelectAppsFolder= () => {
    console.log('called onSelectAppsFolder');
    const path2 = dialog.showOpenDialog(
    { title: 'Select a folder', properties: ['openDirectory'] }
  );
    if (path2 === undefined) {
      console.log('No destination folder selected');
      this.setState({ appsFolderSelected: false });
      this.setState({ appsFolder: '' });
    } else {
        // console.log('going to set the path and boolean' + path);
      this.setState({ appsFolderSelected: true });
      this.setState({ appsFolder: path2[0] });
      console.log(path2[0]);
    }
    console.log('end of onSelectAppsFolder');
  };

  onProcessAllCountryFilesInFolder = () => {
    console.log('called onProcessAllCountryFilesInFolder');
    this.setState({ countryDataAllApps: [] });
    const directoryPath = this.state.appsFolder;
    fs.readdir(directoryPath, this.saveAppDataFromEachCountriesFile);
    console.log('end of onProcessAllCountryFilesInFolder');
  };

  onProcessAllOverviewFilesInFolder = () => {
    console.log('called onProcessAllOverviewFilesInFolder');
    this.setState({ overviewDataAllApps: [] });
    const directoryPath = this.state.appsFolder;
    fs.readdir(directoryPath, this.saveAppDataFromEachOverviewFile);
    console.log('end of onProcessAllOverviewFilesInFolder');
  };

  onProcessAllOSversionFilesInFolder = () => {
    console.log('called onProcessAllOSversionFilesInFolder');
    this.setState({ osversionDataAllApps: [] });
    const directoryPath = this.state.appsFolder;
    fs.readdir(directoryPath, this.saveAppDataFromEachOSversionFile);
    console.log('end of onProcessAllOSversionFilesInFolder');
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

  saveAppDataFromEachCountriesFile = (err, files) => {
    console.log('called saveAppDataFromEachCountriesFile');
      // handling error
    if (err) {
      return console.log(`Unable to scan directory: ${err}`);
    }
    Promise.all(
          Array.from(files).map(entry => this.getAppDataFromCountriesFile(entry))
      ).then(() => {
          // All done
        console.log('all done now');
      });
    console.log('end of saveAppDataFromEachCountriesFile');
  };
  getAppDataFromCountriesFile = (fileName) => {
    console.log('entering getAppDataFromCountriesFile');
    // Do whatever you want to do with the file
    const fileNamePath = path.join(this.state.appsFolder, fileName);
    // console.log('fileNamePath--> ' + fileNamePath);
    this.parseDataWithPapaParse(fileNamePath, this.doStuffCountriesFile);
    console.log('leaving getAppDataFromCountriesFile');
  };
  doStuffCountriesFile = (data) => {
      // Data is usable here
      // console.log(data);
    const lastEntry = data[data.length - 2];
    const packageName = lastEntry[1];
    console.log(`PackageName: ${packageName}`);
    const lastTransactionDate = lastEntry[0];
    let i = data.length - 2;
    const appData = [];
    let countryRow = {};
    while (data[i][0] === lastTransactionDate) {
      const row = data[i];
      // console.log('Code: ' + row[2] + ', TotalInstalls: ' + row[6] + ', ActiveDevices: ' + row[9] +", Country => " + countriesIso.getName(row[2], "en") );
      if (row[2] === '') {
        countryRow = { code: '??', installs: row[6], active: row[9], country: 'unknown' };
      } else {
        countryRow = { code: row[2], installs: row[6], active: row[9], country: countriesIso.getName(row[2], 'en') };
      }
        // console.log (countryRow);
      appData.push(countryRow);
        // console.log(tableData);
      i--;
    }
    const countryEntry = { packageName, countryData: appData };
    const countryAllData = this.state.countryDataAllApps;
    countryAllData.push(countryEntry);
    this.setState({ countryDataAllApps: countryAllData });
  };

  saveAppDataFromEachOverviewFile = (err, files) => {
    console.log('called saveAppDataFromEachOverviewFile');
      // handling error
    if (err) {
      return console.log(`Unable to scan directory: ${err}`);
    }
    this.setState({ totalNumberOfWBTApps: files.length });
    Promise.all(
          Array.from(files).map(entry => this.getAppDataFromOverviewFile(entry))
      ).then(() => {
          // All done
        console.log('all done now');
      });
    console.log('end of saveAppDataFromEachOverviewFile');
  };
  getAppDataFromOverviewFile = (fileName) => {
    console.log('entering getAppDataFromOverviewFile');
    // Do whatever you want to do with the file
    const fileNamePath = path.join(this.state.appsFolder, fileName);
    // console.log('fileNamePath--> ' + fileNamePath);
    this.parseDataWithPapaParse(fileNamePath, this.doStuffOverviewFile);
    console.log('leaving getAppDataFromOverviewFile');
  };
  doStuffOverviewFile = (data) => {
      // Data is usable here
      // console.log(data);
      // console.log( data.length);
    const lastEntry = data[data.length - 2];
    const tmpListOfApps = this.state.overviewDataAllApps;
    tmpListOfApps.push(lastEntry);
    this.setState({ overviewDataAllApps: tmpListOfApps });
  };

  saveAppDataFromEachOSversionFile = (err, files) => {
    console.log('called saveAppDataFromEachOSversionFile');
      // handling error
    if (err) {
      return console.log(`Unable to scan directory: ${err}`);
    }
    Promise.all(
          Array.from(files).map(entry => this.getAppDataFromOSVersionFile(entry))
      ).then(() => {
          // All done
        console.log('all done now');
      });
    console.log('end of saveAppDataFromEachOSversionFile');
  };
  getAppDataFromOSVersionFile = (fileName) => {
    console.log('entering getAppDataFromOSVersionFile');
    // Do whatever you want to do with the file
    const fileNamePath = path.join(this.state.appsFolder, fileName);
    // console.log('fileNamePath--> ' + fileNamePath);
    this.parseDataWithPapaParse(fileNamePath, this.doStuffOsVersionFile);
    console.log('leaving getAppDataFromOSVersionFile');
  };
  doStuffOsVersionFile = (data) => {
      // Data is usable here
    console.log(data);
    this.setState({ csvOsVersionFileData: data });
    const lastEntry = data[data.length - 2];
    const packageName = lastEntry[1];
    console.log(`PackageName: ${packageName}`);
    const lastTransactionDate = lastEntry[0];
    let i = data.length - 2;
    const tableData = [];
    let tableRow = {};
    while (data[i][0] === lastTransactionDate) {
      const row = data[i];
      if (row[2] === '') {
        tableRow = { osVersion: 'unknown', installs: row[6], active: row[9] };
      } else {
        tableRow = { osVersion: row[2], installs: row[6], active: row[9] };
      }
      console.log(tableRow);
      tableData.push(tableRow);
        // console.log(tableData);
      i--;
    }
    const osVersionEntry = { packageName, osVersionData: tableData };
    const osVersionAllData = this.state.osversionDataAllApps;
    osVersionAllData.push(osVersionEntry);
    this.setState({ osversionDataAllApps: osVersionAllData });
  };

  savePackageTitlesToArray = () => {
    // All done
    console.log('enter of savePackageTitlesToArray');
    this.setState({ listOfAppTitles: [] });
    // console.log(this.state.listOfApps)
    let tmpListOfApps = [];
    tmpListOfApps = this.state.overviewDataAllApps;
    // console.log('tmpListOfApps --->'  + tmpListOfApps);
    // console.log('tmpListOfApps.lengt --->'  + tmpListOfApps.length);
    let i = 0;
    for (i = 0; i < tmpListOfApps.length; i++) {
      // console.log('packageName --->'  + packageName);
      this.getGooglePlayGetAppTitle(tmpListOfApps[i]);
    }
    console.log('end of savePackageTitlesToArray');
  };

  getGooglePlayGetAppTitle = (packageInfo) => {
    console.log('entering getGooglePlayAppResults');
    const appPackageName = packageInfo[1];
    // let totalUserInstalls =  packageInfo[5];
    // let activeDeviceInstalls = packageInfo[8];
    // eg 'org.scriptureearth.adj.nt.apk'
    gplay.app({ appId: appPackageName, throttle: 10 })
        .then((value) => {
          const appTitles = this.state.listOfAppTitles;
          const appInfo = { packageName: appPackageName, title: value.title };
          appTitles.push(appInfo);
          console.log(`App Title gplay--> ${value.title}`);
          this.setState({ titleFromScraperApp: value.title });
          this.setState({ listOfAppTitles: appTitles });
          this.setState({ numberOfAppTitlesProcessed: appTitles.length });
        }).catch((fromReject) => {
          console.log('A REJECT promise occured while running google-play-scraper for ');
          console.log('this package because it is UNPUBLISHED but has some installs -->');
          console.log(appPackageName);
          console.log(`error message is --> ${fromReject}`);
          this.setState({ titleFromScraperApp: 'Current App Unplublished' });
          const appTitles = this.state.listOfAppTitles;
          const appInfo = { packageName: appPackageName, title: 'UNPUBLISHED' };
          appTitles.push(appInfo);
          this.setState({ titleFromScraperApp: 'UNPUBLISHED' });
          this.setState({ listOfAppTitles: appTitles });
          this.setState({ numberOfAppTitlesProcessed: appTitles.length });
        });
    console.log('leaving getGooglePlayAppResults');
  }; //= ================ getGooglePlayAppResults

  onCombineDataAndSave = () => {
    console.log('entering onCombineDataAndSave');
    const countryDataArray = this.state.countryDataAllApps;
    const osversionDataArray = this.state.osversionDataAllApps;
    const overviewData = this.state.overviewDataAllApps;
    const appTitles = this.state.listOfAppTitles;

    const combinedData = [];
    let combinedDataOneApp = {};
    let packageName = '';
    let appTitle = '';
    let totalUserInstalls = '';
    let activeDeviceInstalls = '';
    let osVersionData = '';
    let countriesData = '';

    let i = 0;
    for (i = 0; i < appTitles.length; i++) {
      packageName = appTitles[i].packageName;
      appTitle = appTitles[i].title;
      totalUserInstalls = overviewData[i][5];
      activeDeviceInstalls = overviewData[i][8];
      osVersionData = osversionDataArray[i].osVersionData;
      countriesData = countryDataArray[i].countryData;
      combinedDataOneApp = { packageName,
        appTitle,
        totalUserInstalls,
        activeDeviceInstalls,
        osversionData: osVersionData,
        countriesData };
      // console.log(combinedDataOneApp);
      combinedData.push(combinedDataOneApp);
    }
    this.setState({ combinedDataToPersist: combinedData });
    console.log('leaving onCombineDataAndSave');
  };


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
    // You can obviously give a direct path without use the dialog (C:/Program Files/path/myfileexample.txt)
    const dataToSave = this.state.combinedDataToPersist;
    content = JSON.stringify(dataToSave);
    dialog.showSaveDialog({ defaultPath: '~/app/components/output/allAppsData.json' }, (fileName) => {
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
    const numberOfAppTitlesProcessed = this.state.numberOfAppTitlesProcessed;
    const totalNumberOfApps = this.state.totalNumberOfWBTApps;
    let currentAppTitle = 'currentAppTitle';
    if (this.state.titleFromScraperApp !== '') { currentAppTitle = this.state.titleFromScraperApp; }
    const jsonDataFile = 'jsonDataFile';
    return (
      <div className="container">
        {/* ===================================================================================================================== */}
        <div className="container">
          <div className="panel panel-primary">
            {/* ===================================================================================================================== */}
            <div className="panel panel-info">
              <div className="panel-heading">Process data from all countries.csv files</div>
              <div className="panel-body">
                <div className="btn-toolbar" role="group" aria-label="Basic example">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onSelectAppsFolder}
                  >1) Select countries Folder for Apps</button>&nbsp;
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onProcessAllCountryFilesInFolder}
                  >2) Extract ...countries.csv files data
                  </button>&nbsp;
                </div>
              </div>
            </div> {/* panel-info */}
            {/* ===================================================================================================================== */}
          </div>
        </div>
        {/* ===================================================================================================================== */}
        <div className="container">
          <div className="panel panel-primary">
            {/* ===================================================================================================================== */}
            <div className="panel panel-info">
              <div className="panel-heading">Process data from all osversion.csv files</div>
              <div className="panel-body">
                <div className="btn-toolbar" role="group" aria-label="Basic example">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onSelectAppsFolder}
                  >1) Select OSversion Folder for Apps</button>&nbsp;
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onProcessAllOSversionFilesInFolder}
                  >2) Extract ...OSversion.csv files data
                  </button>&nbsp;
                </div>
              </div>
            </div> {/* panel-info */}
            {/* ===================================================================================================================== */}
          </div>
        </div>
        {/* ===================================================================================================================== */}
        <div className="container">
          <div className="panel panel-primary">
            {/* ===================================================================================================================== */}
            <div className="panel panel-info">
              <div className="panel-heading">Process data from all overview.csv files</div>
              <div className="panel-body">
                <div className="btn-toolbar" role="group" aria-label="Basic example">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onSelectAppsFolder}
                  >1) Select overview Folder for Apps</button>&nbsp;
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onProcessAllOverviewFilesInFolder}
                  >2) Extract ...overview.csv files data
                  </button>&nbsp;
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.savePackageTitlesToArray}
                  >3) Run Scraper for App Titles
                  </button>&nbsp;
                </div>
                <br />
                <div className="form-group">
                  <label className="col-sm-4 control-label" htmlFor="currentAppTitle">Current App Title</label>
                  <div className="form-text" id="currentAppTitle" placeholder="currentAppTitle" >{currentAppTitle}</div>
                  <br />
                  <label className="col-sm-4 control-label" htmlFor="totalNumberOfApps">Total Number of Apps to Process</label>
                  <div className="form-text" id="totalNumberOfApps" placeholder="totalNumberOfApps" >{totalNumberOfApps}</div>
                  <br />
                  <label className="col-sm-4 control-label" htmlFor="numberOfAppTitlesProcessed">Number of App Titles Processed</label>
                  <div className="form-text" id="numberOfAppTitlesProcessed" placeholder="numberOfAppTitlesProcessed" >{numberOfAppTitlesProcessed}</div>
                </div> {/* form-group */}
              </div>
            </div> {/* panel-info */}
            {/* ===================================================================================================================== */}
          </div>
        </div>
        {/* ===================================================================================================================== */}
        <div className="container">
          <div className="panel panel-primary">
            {/* ===================================================================================================================== */}
            <div className="panel panel-info">
              <div className="panel-heading">Combine Data for All Apps and Save as Json file</div>
              <div className="panel-body">
                <div className="btn-toolbar" role="group" aria-label="Basic example">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onCombineDataAndSave}
                  >Combine Data</button>&nbsp;
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
            {/* ===================================================================================================================== */}
          </div>
        </div>
        {/* ===================================================================================================================== */}

      </div>
    );
  }
}


export default ImportCsvDataAllApps;
