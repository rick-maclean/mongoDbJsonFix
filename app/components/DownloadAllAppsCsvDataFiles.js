// @flow
import React, { Component } from 'react';
import electron from 'electron';

var path = require('path');
var fs = require('fs');
var cmd=require('node-cmd');

const dt = new Date();
const monthsNums = [
'01', '02', '03', '04', '05',
'06', '07', '08', '09',
'10', '11', '12'
];

class DownloadAllAppsCsvDataFiles extends Component {
  props: {
  };
  state: {
    titleFromScraperApp: string
  }
  constructor() {
    super();
    this.gsutilDownloadNewestWbtOverviewFiles = this.gsutilDownloadNewestWbtOverviewFiles.bind(this);
    this.gsutilDownloadNewestWbtCountryFiles = this.gsutilDownloadNewestWbtCountryFiles.bind(this);
    this.gsutilDownloadNewestWbtOsVersionFiles = this.gsutilDownloadNewestWbtOsVersionFiles.bind(this);
    this.state = {
      titleFromScraperApp: "no package chosen yet 2"

    };
  }
  gsutilDownloadNewestWbtOverviewFiles = () => {
    console.log('entering gsutilDownloadStatFilesFromGooglePlay');
    this.gsutilDownloadStatFilesFromGooglePlay('overview-files/', '*_overview.csv ');
    console.log('leaving gsutilDownloadNewestWbtOverviewFiles');
  }
  gsutilDownloadNewestWbtCountryFiles = () => {
    console.log('entering gsutilDownloadStatFilesFromGooglePlay');
    this.gsutilDownloadStatFilesFromGooglePlay('countries-files/', '*_country.csv ');
    console.log('leaving gsutilDownloadNewestWbtOverviewFiles');
  }
  gsutilDownloadNewestWbtOsVersionFiles = () => {
    console.log('entering gsutilDownloadStatFilesFromGooglePlay');
    this.gsutilDownloadStatFilesFromGooglePlay('osversion-files/','*_os_version.csv ');
    console.log('leaving gsutilDownloadNewestWbtOverviewFiles');
  }

  gsutilDownloadStatFilesFromGooglePlay = (path, filetype) => {
    console.log('entering gsutilDownloadStatFilesFromGooglePlay');
    //first remove old filesToDownload
    let command = 'rm app/components/gsutil-download-' + path + '*.*';
    console.log(command);
    cmd.run(command);
    console.log('before');
    setTimeout(function(){
        console.log('after');
    },30000000);

    let filesToDownload = 'gs://pubsite_prod_rev_05224823036325035822/stats/installs/*' + dt.getFullYear() + monthsNums[dt.getMonth()] + filetype;
    console.log(filesToDownload);
    command = 'gsutil cp -r ' + filesToDownload + 'app/components/gsutil-download-' + path;
    console.log(command);
    cmd.run(command);
    /*
    cmd.get(
        'ls app/components/gsutil-download-currentMonth',
        function(err, data, stderr){
            console.log('the dir app/components/gsutil-download-currentMonth contains these files :\n\n',data)
        }
    );
    */
    console.log('leaving gsutilDownloadStatFilesFromGooglePlay');
  }

  render() {
    let dt = new Date();
    let months = [
    'January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September',
    'October', 'November', 'December'
    ];
    let currentMonthYear = 'currentMonthYear';
    currentMonthYear =  months[dt.getMonth()]  + ' '+ dt.getFullYear();

    return (
      <div className="panel-group">
         <div className="panel panel-primary">
          <div className="panel-heading apt-addheading">Wycliffe Bible Translators Google Play Store</div>
          <div className="panel panel-info">
            <div className="panel-heading">Download This Month's csv Files for All WBT Apps</div>
            <div className="panel-body">
              <div className="form-group">
                <label className="col-sm-4 control-label" htmlFor="currentMonthYear">Current Month and Year</label>
                <div className="form-text" id="currentMonthYear" placeholder="currentMonthYear" >{currentMonthYear}</div>
              </div> {/* form-group */}
              <div className="btn-toolbar" role="group" aria-label="Basic example">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.gsutilDownloadNewestWbtOverviewFiles}
                >Download overview.csv Files</button>&nbsp;
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.gsutilDownloadNewestWbtCountryFiles}
                >Download country.csv Files</button>&nbsp;
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.gsutilDownloadNewestWbtOsVersionFiles}
                >Download os_version.csv Files</button>&nbsp;
              </div>

            </div>
            </div>
          </div>
      </div>
    );
  }

}

export default DownloadAllAppsCsvDataFiles;
