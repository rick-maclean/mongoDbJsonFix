// @flow
import React, { Component } from 'react';

var products2 = [{
  id: 1,
  name: "Product1",
  price: 120
},
{
  id: 2,
  name: "Product2",
  price: 80
}];

class Table extends Component {
  render() {
    return (
      <BootstrapTable data={ products2 }>
        <TableHeaderColumn dataField='id' isKey width='30%'>Product ID</TableHeaderColumn>
        <TableHeaderColumn dataField='name' width='%30'>Product Name</TableHeaderColumn>
        <TableHeaderColumn dataField='price' width='40%'>Product Price</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}





export default Table;
