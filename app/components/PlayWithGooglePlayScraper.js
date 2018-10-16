// @flow
import React, { Component } from 'react';

const gplay = require('google-play-scraper');

class PlayWithGooglePlayScraper extends Component {
  state: {
    aBoolian: boolean,
    value: string,
    title: string,
    tryText: string,
    titleFromScraperApp: string
  };
  constructor() {
    super();
    this.onGetGooglePlayAppInfo = this.onGetGooglePlayAppInfo.bind(this);
    this.handleTryText = this.handleTryText.bind(this);
    // this.onProcessCsvFile = this.onProcessCsvFile.bind(this);
    this.state = {
      aBoolian: true,
      value: 'some value',
      title: 'some value',
      tryText: 'someText',
      titleFromScraperApp: 'scraperApp string'
    };
  }

  handleTryText = (event) => {
    const target = event.target;
    console.log(target.name);
    console.log(target.value);
    if (target.name === 'appTitle') {
      this.setState({ title: target.value });
    }
    console.log(this.state.title);
    // this.props.onTryText(this.state.tryText);
  };


  onGetGooglePlayAppInfo = () => {
    console.log('entering getGooglePlayAppResults');
    // let appPackageName = 'com.king.candycrush4';
    // if (this.state.title.length !== 0) {
    //   appPackageName = this.state.title;
    // }
    // console.log(`appPackageName ====> ${appPackageName}`);
    // gplay.app({ appId: appPackageName })
    //   .then((value) => {
    //     console.log(`App Title gplay--> ${value.title}`);
    //     this.setState({ titleFromScraperApp: value.title });
    //     console.log(`App INFO RETURNED--> ${value}`);
    //     return value;
    //   }).catch((fromReject) => {
    //     console.log('A REJECT promise occured while running google-play-scraper for ');
    //     console.log('this package because it is UNPUBLISHED but has some installs -->');
    //     console.log(appPackageName);
    //     console.log(`error message is --> ${fromReject}`);
    //   });
    // gplay.app({ appId: 'com.dxco.pandavszombies' })
    //   .then(console.log, console.log);


    gplay.list({
      category: gplay.category.GAME,
      collection: gplay.collection.TOP_FREE,
      num: 2
    })
      .then(console.log, console.log);

    // gplay.developer({ devId: 'Wycliffe' })
    //   .then(console.log)
    //   .catch((fromReject) => {
    //     console.log(`error message is --> ${fromReject}`);
    //   });

    console.log('leaving getGooglePlayAppResults');
  }; //= ================ getGooglePlayAppResults

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
                    onClick={this.onGetGooglePlayAppInfo}
                  >Get Google Play stuff from name</button>&nbsp;
                </div>
                <div className="form-group">
                  <label className="col-sm-3 control-label" htmlFor="trytext">This is the Google Play App Name: </label>
                  <div className="col-sm-9">
                    <input
                      name="appTitle"
                      type="text" className="form-control"
                      id="appTitle"
                      onChange={this.handleTryText}
                      value={this.state.title}
                      placeholder="Text"
                    />
                  </div>
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

export default PlayWithGooglePlayScraper;
