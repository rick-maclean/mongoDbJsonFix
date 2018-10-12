// @flow
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
//  import { Link } from 'react-router-dom';
//  import styles from './UpdateStateInHome.css';

class UpdateStateInHome extends Component {
  props: {
    onTryText: () => void,
    onChangeTextToHomeNoDelay: () => void,
    textToHome: string
  };
  state: {
    tryText: string
  }
  constructor() {
    super();
    this.state = {
      tryText: 'someText'
    };
  }
  handleTryText = (event) => {
    const target = event.target;
    console.log(target.name);
    console.log(target.value);
    if (target.name === 'tryTextBox') {
      this.setState({ tryText: target.value });
    }
    this.props.onTryText(this.state.tryText);
  }

  render() {
    //  const { emailAddy } = this.props;
    const { textToHome } = this.props;
    return (
      <div className="panel panel-primary">
        <div className="panel-heading apt-addheading">UpdateStateInHome....see how text fields are handled</div>
        <br /> <p> <i>Blah blah</i> </p>
        <div className="panel-body">
          <form className="form-signin form-horizontal" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label className="col-sm-3 control-label" htmlFor="textToHome">SampleTextNoDelayInHome</label>
              <div className="col-sm-9">
                <input
                  name="textToHome"
                  type="text" className="form-control"
                  id="textToHome"
                  onChange={this.props.onChangeTextToHomeNoDelay}
                  value={textToHome}
                  placeholder="Text"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-3 control-label" htmlFor="trytext">SampleTextDelays1Char</label>
              <div className="col-sm-9">
                <input
                  name="tryTextBox"
                  type="text" className="form-control"
                  id="trytext"
                  onChange={this.handleTryText}
                  value={this.state.tryText}
                  placeholder="Text"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default UpdateStateInHome;
