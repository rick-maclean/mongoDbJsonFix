// @flow
import React, { Component } from 'react';
// import electron from 'electron';
// import styles from './Home.css';
import ImportCsvData from '../components/ImportCsvData';
import RequestHttpClientUse from './RequestHttpClientUse';
import PlayWithGooglePlayScraper from './PlayWithGooglePlayScraper';

export default class Home extends Component {
  state: {
    someStateVariable: string
  };
  constructor() {
    super();
    this.state = {
      someStateVariable: 'just a place holder for demo of structure'
    };
  }
  render() {
    return (
      <div>
        <div className="container">
          <div className="App-header">
            <h2>SeedCo Fix Stripe/Mongo Transactions</h2>
          </div>
          <ImportCsvData />
          <PlayWithGooglePlayScraper />
          <RequestHttpClientUse />

        </div>
      </div>
    );
  }
}
