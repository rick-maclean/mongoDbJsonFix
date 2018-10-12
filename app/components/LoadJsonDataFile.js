// @flow
import React, { Component } from 'react';
import electron from 'electron';
import jquery from 'jquery';
// import PropTypes from 'prop-types';
//  import { Link } from 'react-router-dom';
//  import styles from './LoginForm.css';

const app = electron.remote;
const dialog = app.dialog;
const fs = require('fs');
const fsOutput = require('fs');
const jsonData = require('./SABprojectsData.json');

class LoadJsonDataFile extends Component {
  state: {
    packageName: string,
    monthYear: string,
    monthUserInstalls: number,
    monthUserUninstalls: number,
    appTitle: string,
    ethnologueCode: string,
    country: string,
    population: number,
    jsonButtonClicked: boolean,
    toggleJsonFileDataUsed: boolean
  }
  constructor() {
    super();
    this.state = {
      packageName: 'org.scriptureearth.djk.nt.apk',
      monthYear: "10/2017",
      monthUserInstalls: 31,
      monthUserUninstalls: 26,
      appTitle: 'Aukaans - Bible',
      ethnologueCode: "djk",
      country: "Suriname",
      population: 39700,
      jsonButtonClicked: false,
      toggleJsonFileDataUsed: false
    };
  }
  readJsonDataFile = () => {
    console.log('called readJsonDataFile');

    console.log("SABprojectsData.json");
    console.log(jsonData);
    let objFromData;
    if (this.state.toggleJsonFileDataUsed){
      this.setState({ toggleJsonFileDataUsed: false });
       objFromData = jsonData[1];
    } else {
      this.setState({ toggleJsonFileDataUsed: true });
      objFromData = jsonData[0];
    }
    console.log("first record from json data file");
    console.log(objFromData);
    console.log(objFromData.packageName);
    console.log(objFromData.population);
    this.setState({ jsonButtonClicked: true });
    this.setState({ packageName: objFromData.packageName });
    this.setState({ monthYear: objFromData.monthYear });
    this.setState({ monthUserInstalls: objFromData.monthUserInstalls });
    this.setState({ monthUserUninstalls: objFromData.monthUserUninstalls });
    this.setState({ appTitle: objFromData.appTitle });
    this.setState({ ethnologueCode: objFromData.ethnologueCode });
    this.setState({ country: objFromData.country });
    this.setState({ population: objFromData.population });
    console.log('end of readJsonDataFile');
  }

  render() {
    /*
    if (this.state.jobFilepathSelected && this.state.metaDataFolderSelected) {
      $('#sendButton').removeAttr('disabled');
    } else {
      $('#sendButton').attr('disabled', 'true');
    }
    */
    let packageName = 'blah packageName';
    let monthYear = 'blah monthYear';
    let monthUserInstalls = -12345;
    let monthUserUninstalls = -12345;
    let appTitle = 'blah appTitle';
    let ethnologueCode = 'blah ethnologueCode';
    let country = 'blala Country';
    let population = -12345;
      packageName = this.state.packageName;
      monthYear = this.state.monthYear;
      monthUserInstalls = this.state.monthUserInstalls;
      monthUserUninstalls = this.state.monthUserUninstalls;
      appTitle = this.state.appTitle;
      ethnologueCode = this.state.ethnologueCode;
      country = this.state.country;
      population = this.state.population;

    if (this.state.jsonButtonClicked) {
      packageName = this.state.packageName;
      monthYear = this.state.monthYear;
      monthUserInstalls = this.state.monthUserInstalls;
      monthUserUninstalls = this.state.monthUserUninstalls;
      appTitle = this.state.appTitle;
      ethnologueCode = this.state.ethnologueCode;
      country = this.state.country;
      population = this.state.population;
    }

    return (
      <div className="panel panel-primary">
        <div className="panel-heading apt-addheading">Read Json Data Files (toggle)</div>
        <div className="panel-body">
          <form className="form" onSubmit={this.localHandleSend}>
            <div className="form-group">
              <label className="col-sm-3 control-label" htmlFor="packageName">Package Name</label>
              <div className="form-text" id="packageName" placeholder="packageName" >{packageName}</div>
              <br></br>
              <label className="col-sm-3 control-label" htmlFor="monthYear">monthYear</label>
              <div className="form-text" id="monthYear" placeholder="monthYear" >{monthYear}</div>
              <br></br>
              <label className="col-sm-3 control-label" htmlFor="monthUserInstalls">monthUserInstalls</label>
              <div className="form-text" id="monthUserInstalls" placeholder="monthUserInstalls" >{monthUserInstalls}</div>
              <br></br>
              <label className="col-sm-3 control-label" htmlFor="monthUserUninstalls">monthUserUninstalls</label>
              <div className="form-text" id="monthUserUninstalls" placeholder="monthUserUninstalls" >{monthUserUninstalls}</div>
              <br></br>
              <label className="col-sm-3 control-label" htmlFor="appTitle">appTitle</label>
              <div className="form-text" id="appTitle" placeholder="appTitle" >{appTitle}</div>
              <br></br>
              <label className="col-sm-3 control-label" htmlFor="ethnologueCode">ethnologueCode</label>
              <div className="form-text" id="ethnologueCode" placeholder="ethnologueCode" >{ethnologueCode}</div>
              <br></br>
              <label className="col-sm-3 control-label" htmlFor="country">country</label>
              <div className="form-text" id="country" placeholder="country" >{country}</div>
              <br></br>
              <label className="col-sm-3 control-label" htmlFor="population">population</label>
              <div className="form-text" id="population" placeholder="population" >{population}</div>
              <br></br>
            </div> {/* form-group */}
            <div className="form-group">
              <div className="col-sm-offset-3 col-sm-9">
                <div className="pull-left">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.readJsonDataFile}
                  >Get JsonData File</button>&nbsp;
                </div>
              </div>  {/* className="col-sm-offset-3 col-sm-9" */}
            </div> {/* form-group */}
          </form>
        </div>
      </div>
    );
  }
}

export default LoadJsonDataFile;
