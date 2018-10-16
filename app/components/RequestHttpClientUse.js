// @flow
import React, { Component } from 'react';

const request = require('request');

class RequestHttpClientUse extends Component {
  state: {
    aBoolian: boolean
  };
  constructor() {
    super();
    this.onUploadDonationRecordsToServer = this.onUploadDonationRecordsToServer.bind(this);
    // this.onProcessCsvFile = this.onProcessCsvFile.bind(this);
    this.state = {
      aBoolian: true
    };
  }
  onUploadDonationRecordsToServer = () => {
    console.log('called onUploadDonationRecordsToServer');
    request('http://www.google.com', (error, response, body) => {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', body); // Print the HTML for the Google homepage.
    });
    console.log('end of onUploadDonationRecordsToServer');
  };

  render() {
    // const jsonDataFile = 'jsonDataFile';
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
                    onClick={this.onUploadDonationRecordsToServer}
                  >Upload to Donation Server</button>&nbsp;
                </div>
              </div>
            </div> {/* panel-info */}
            {/* ================================================================================ */}
          </div>
        </div>
        {/* =================================================================================== */}

      </div>
    );
  }
}

export default RequestHttpClientUse;

