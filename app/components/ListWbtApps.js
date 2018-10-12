// @flow
import React, { Component } from 'react';
import electron from 'electron';
import Papa from 'papaparse';

// with es6
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

var gplay = require('google-play-scraper');
//requiring path and fs modules
var path = require('path');
var fs = require('fs');
var cmd=require('node-cmd');

const app = electron.remote;
const dialog = app.dialog;

const dt = new Date();
const monthsNums = [
'01', '02', '03', '04', '05',
'06', '07', '08', '09',
'10', '11', '12'
];

class ListWbtApps extends Component {
  props: {
  };
  state: {
    tableOfApps: array,
    tableOfApps2: array,
    appsFolderSelected: boolean,
    appsFolder: string,
    oneDataItem : array,
    listOfFiles : array,
    listOfPackageNames : array,
    listOfApps : array,
    listOfAppTitles : array,

    titleFromScraperApp: string
  }
  constructor() {
    super();
    this.addEntryToTable = this.addEntryToTable.bind(this);
    this.onSelectAppsFolder = this.onSelectAppsFolder.bind(this);
    this.onListFilesInFolder = this.onListFilesInFolder.bind(this);
    this.onProcessAllOverviewFilesInFolder = this.onProcessAllOverviewFilesInFolder.bind(this);
    this.onProcessListOfApps = this.onProcessListOfApps.bind(this);
    this.onDisplayDataInTable = this.onDisplayDataInTable.bind(this);

    this.readOverviewCsvFilePP = this.readOverviewCsvFilePP.bind(this);
    this.getGooglePlayAppResults = this.getGooglePlayAppResults.bind(this);
    this.savePackageNamesToArray = this.savePackageNamesToArray.bind(this);
    this.savePackageNamesToArray2 = this.savePackageNamesToArray2.bind(this);


    this.state = {
      tableOfApps: [],
      tableOfApps2: [],
      appsFolderSelected: false,
      appsFolder: 'appsFolder',
      oneDataItem: [],
      listOfFiles: [],
      listOfApps: [],
      listOfPackageNames: [],
      listOfAppTitles: [],
      titleFromScraperApp: "no package chosen yet 2"

    };
  }

  readOverviewCsvFilePP = () => {
    console.log('entering readOverviewCsvFilePP');
    const filename = this.state.csvOverviewFile;
    this.parseDataWithPapaParse(filename, this.doStuffOverview);

    console.log('leaving readOverviewCsvFilePP');
  }

  onSelectAppsFolder= () =>  {
  console.log('called onSelectAppsFolder');
  var path = dialog.showOpenDialog(
    { title:"Select a folder", properties: ["openDirectory"] }
  );
  if(path === undefined){
      console.log("No destination folder selected");
      this.setState({ appsFolderSelected: false });
      this.setState({  appsFolder: '' });
  }else{
        //console.log('going to set the path and boolean' + path);
        this.setState({ appsFolderSelected: true });
        this.setState({  appsFolder: path[0] });
        console.log(path[0]);
    }
    console.log('end of onSelectAppsFolder');
  }

  onListFilesInFolder = () =>  {
    console.log('called onListFilesInFolder');
    let directoryPath = this.state.appsFolder;
    fs.readdir(directoryPath, function (err, files) {
      //handling error
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      }
      //this.setState({ listOfFiles: files });
      //listing all files using forEach
      files.forEach(function (file) {
          // Do whatever you want to do with the file
          let fileNamePath = path.join(this.state.appsFolder, fileName);
          console.log(fileNamePath);
      });
    });
    console.log('end of onListFilesInFolder');
  }
  onProcessAllOverviewFilesInFolder = () =>  {
    console.log('called onProcessAllOverviewFilesInFolder');
    this.setState({ listOfApps: [] });
    let directoryPath = this.state.appsFolder;
    fs.readdir(directoryPath, this.saveAppDataFromEachOverviewFile);
    console.log('end of onProcessAllOverviewFilesInFolder');
  }

  saveAppDataFromEachOverviewFile = (err, files) =>  {
    console.log('called saveAppDataFromEachOverviewFile');
      //handling error
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      }
      Promise.all(
          Array.from(files).map(entry => this.getAppDataFromFile(entry))
      ).then(() => {
          // All done
          console.log('all done now');
      });
    console.log('end of saveAppDataFromEachOverviewFile');
  }


  getAppDataFromFile = (fileName) => {
    //console.log('entering getAppDataFromFile');
    // Do whatever you want to do with the file
    let fileNamePath = path.join(this.state.appsFolder, fileName);
    //console.log('fileNamePath--> ' + fileNamePath);
    this.parseDataWithPapaParse(fileNamePath, this.doStuffOverview);
    //console.log('leaving getAppDataFromFile');
  }
  parseDataWithPapaParse = (url, callBack) => {
      Papa.parse(url, {
          download: true,
          dynamicTyping: true,
          complete: function(results) {
              callBack(results.data);
          }
      });
  }
  doStuffOverview = (data) => {
      //Data is usable here
      //console.log(data);
      //console.log( data.length);
      const lastEntry = data[data.length-2];
      let tmpListOfApps = this.state.listOfApps;
      tmpListOfApps.push(lastEntry);
      this.setState({ listOfApps: tmpListOfApps });
  }

  onProcessListOfApps = () => {
    this.savePackageNamesToArray2();
  }

  savePackageNamesToArray2 = () => {
    // All done
    console.log('enter of savePackageNamesToArray');
    //console.log(this.state.listOfApps)
    let tmpListOfApps = [];
    tmpListOfApps = this.state.listOfApps;
    //console.log('tmpListOfApps --->'  + tmpListOfApps);
    //console.log('tmpListOfApps.lengt --->'  + tmpListOfApps.length);
    let i = 0;
    for (i=0; i < tmpListOfApps.length; i++)
    {
      //console.log('packageName --->'  + packageName);
      this.getGooglePlayAppResults2(tmpListOfApps[i]);
    }
    console.log('end of savePackageNamesToArray');
  }

  getGooglePlayAppResults2 = (packageInfo) => {
    console.log('entering getGooglePlayAppResults');
    let appPackageName = packageInfo[1];
    let totalUserInstalls =  packageInfo[5];
    let activeDeviceInstalls = packageInfo[8];
    // eg 'org.scriptureearth.adj.nt.apk'
    gplay.app({appId: appPackageName, throttle: 10})
        .then((value) => {

          this.setState({ titleFromScraperApp: value.title });

          let tableEntries = this.state.tableOfApps2;
          let tableEntry = { "packageName": appPackageName, "title": value.title, "score": value.score,
              "totalInstalls": totalUserInstalls, "activeInstalls": activeDeviceInstalls};
          tableEntries.push(tableEntry);
          this.setState({ tableOfApps2: tableEntries });

          //let appTitles = this.state.listOfAppTitles;
          //let appInfo = { "packageName": appPackageName, "title": value.title, "score": value.score};
          //appTitles.push(appInfo);
          //console.log('App Title gplay--> ' + value.title);
          //this.setState({ listOfAppTitles: appTitles });
        }).catch( (fromReject) => {
          let tableEntries = this.state.tableOfApps2;
          let tableEntry = { "packageName": appPackageName, "title": 'UNPUBLISHED', "score": 'UNPUBLISHED',
              "totalInstalls": totalUserInstalls, "activeInstalls": activeDeviceInstalls};
          tableEntries.push(tableEntry);
          this.setState({ tableOfApps2: tableEntries });
          console.log('A REJECT promise occured while running google-play-scraper for ')
          console.log('this package because it is UNPUBLISHED but has some installs -->');
          console.log(appPackageName)
          console.log('error message is --> ' + fromReject);
          //this.setState({ titleFromScraperApp: 'Current App Unplublished' });
          //let appTitles = this.state.listOfAppTitles;
          //let appInfo = { "packageName": appPackageName,  "title": 'UNPUBLISHED', "score": 0};
          //appTitles.push(appInfo);
          //this.setState({ listOfAppTitles: appTitles });
        });
    console.log('leaving getGooglePlayAppResults');
  } //================= getGooglePlayAppResults

  onDisplayDataInTable = () => {
    let tableEntries = this.state.tableOfApps2;
    this.setState({ tableOfApps: tableEntries });
  }

  savePackageNamesToArray = () => {
    // All done
    console.log('enter of savePackageNamesToArray');
    let i = 0;
    //console.log(this.state.listOfApps)
    let tmplistOfPackageNames = [];
    let tmpListOfApps = [];
    tmpListOfApps = this.state.listOfApps;
    //console.log('tmpListOfApps --->'  + tmpListOfApps);
    //console.log('tmpListOfApps.lengt --->'  + tmpListOfApps.length);
    for (i=0; i < tmpListOfApps.length; i++)
    {
      let packageName = tmpListOfApps[i][1];
      //console.log('packageName --->'  + packageName);
      tmplistOfPackageNames.push(packageName);
    }
    this.setState({ listOfPackageNames: tmplistOfPackageNames });

    for (i=0; i < tmplistOfPackageNames.length; i++)
    {
      let packageName = tmplistOfPackageNames[i];
      //console.log('packageName --->'  + packageName);
      this.getGooglePlayAppResults(packageName);
    }
    console.log('end of savePackageNamesToArray');
  }

  getGooglePlayAppResults = (packageName) => {
    console.log('entering getGooglePlayAppResults');
    const appPackageName = packageName;
    // eg 'org.scriptureearth.adj.nt.apk'
    gplay.app({appId: appPackageName, throttle: 5})
        .then((value) => {
          this.setState({ titleFromScraperApp: value.title });
          //this.setState({ reviewsFromScraperApp: value.reviews });
          //this.setState({ scoreNameFromScraperApp: value.score });
          //this.setState({ versionFromScraperApp: value.version });
          let appTitles = this.state.listOfAppTitles;
          let appInfo = { "packageName": appPackageName, "title": value.title, "score": value.score};
          appTitles.push(appInfo);
          //console.log('App Title gplay--> ' + value.title);
          this.setState({ listOfAppTitles: appTitles });
        }).catch( (fromReject) => {
          console.log('this package returned a REJECT promise error -->' + appPackageName);
          console.log('error message is -->' + fromReject);
          this.setState({ titleFromScraperApp: 'Current App Unplublished' });
          let appTitles = this.state.listOfAppTitles;
          let appInfo = { "packageName": appPackageName,  "title": 'UNPUBLISHED', "score": 0};
          appTitles.push(appInfo);
          this.setState({ listOfAppTitles: appTitles });
        });
    console.log('leaving getGooglePlayAppResults');
  } //================= getGooglePlayAppResults

  addEntryToTable = () => {
    console.log('entering addEntryToTable');
    let wbtAppsUpdated = [
      {
        title: "Ga'dang - Bible",
        packageName: 'org.wycliffe.gdg.nt.apk',
        totalInstalls: 0,
        activeInstalls: 0
      },
      {
        title: "Garífuna (Caribe) - Bible",
        packageName: 'org.scriptureearth.cab.nt.apk',
        totalInstalls: 0,
        activeInstalls: 0
      },
      {
        title: "Alamblak - Bible",
        packageName: 'org.scriptureearth.amp.nt.apk',
        totalInstalls: 0,
        activeInstalls: 0
      }];

      this.setState({ tableOfApps: wbtAppsUpdated });
    console.log('leaving addEntryToTable');
  }

  render() {
    //  const { emailAddy } = this.props;
    //  const { propInHome } = this.props;
    let wbtApps = [
      {
        title: "Ga'dang - Bible",
        packageName: 'org.wycliffe.gdg.nt.apk',
        totalInstalls: 0,
        activeInstalls: 0
      },
      {
        title: "Garífuna (Caribe) - Bible",
        packageName: 'org.scriptureearth.cab.nt.apk',
        totalInstalls: 0,
        activeInstalls: 0
      }];

      let currentAppTitle = 'currentAppTitle';
      if (this.state.titleFromScraperApp != '')
      currentAppTitle = this.state.titleFromScraperApp;

      if (this.state.tableOfApps.length != 0)
      {
        wbtApps = this.state.tableOfApps;
      }

    return (
      <div className="panel-group">
          <div className="panel panel-info">
            <div className="panel-heading">Display All Wycliffe Bible Translators Apps</div>
            <div className="panel-body">
              <div className="btn-toolbar" role="group" aria-label="Basic example">

                <div className="pull-left">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onSelectAppsFolder}
                  >1) Select Folder for overview.csv files</button>&nbsp;
                </div>
                { /*
                  <div className="col-sm-offset-4">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.onListFilesInFolder}
                    >console.log ==> files In Folder</button>&nbsp;
                  </div>
                */}
              </div>
              <br/>
              <div className="btn-toolbar" role="group" aria-label="Basic example">
                <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.onProcessAllOverviewFilesInFolder}
                    >2) Extract overview.csv files data
                </button>&nbsp;
                <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.onProcessListOfApps}
                    >3) Process Data For Table
                </button>&nbsp;
                <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.onDisplayDataInTable}
                    >4) Display Data in Table
                </button>&nbsp;
              </div>
              <br/>
              <div className="form-group">
                <label className="col-sm-4 control-label" htmlFor="currentAppTitle">Current App Title</label>
                <div className="form-text" id="currentAppTitle" placeholder="currentAppTitle" >{currentAppTitle}</div>
              </div> {/* form-group */}
            </div>
          </div>
          {/* ===================================================================================================================== */}
          <div className="panel panel-info">
            <div className="panel-heading">Table of Apps</div>
            <div className="panel-body">
              <BootstrapTable data={wbtApps} headerStyle={ { borderRadius: 0, border: 0, padding : 0, backgroundColor: '#eeeeee'  } } search searchPlaceholder='type items to search for...' multiColumnSearch pagination>
                  <TableHeaderColumn isKey dataField='title' width='30%'>App Title</TableHeaderColumn>
                  <TableHeaderColumn dataField='packageName' width='35%'>Package Name</TableHeaderColumn>
                  <TableHeaderColumn dataField='totalInstalls' width='15%'>Total Installs</TableHeaderColumn>
                  <TableHeaderColumn dataField='activeInstalls' width='15%'>Active Installs</TableHeaderColumn>
              </BootstrapTable>
            </div>
          </div>
        </div>
    );
  }
}

export default ListWbtApps;
