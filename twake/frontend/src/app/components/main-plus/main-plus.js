import React, { Component } from 'react';
import Icon from 'components/icon/icon.js';
import Menu from 'components/menus/menu.js';
import './main-plus.scss';

export default class MainPlus extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (this.props.onClick) {
      return (
        <div className="main_plus_button" onClick={this.props.onClick}>
          <Icon type="plus" className="m-icon-small" />
        </div>
      );
    }
    return (
      <Menu menu={this.props.menu} className="main_plus_button" position={'top'}>
        <Icon type="plus" className="m-icon-small" />
      </Menu>
    );
  }
}
