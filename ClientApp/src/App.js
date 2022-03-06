import React, { Component } from 'react';

export default class App extends Component {
  constructor(props) {
    super(props);
      this.state = {data:[]}
  }
  componentDidMount() {
    this.getData();
  }

  async getData() {
      const response = await fetch('/Employees/Get');
      const json = await response.json();
      this.setState({data:json});
  }

  render () {
    return (
        <table className='table table-striped' aria-labelledby="tabelLabel">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Value</th>

                </tr>
            </thead>
            <tbody>
                {this.state.data.map(item =>
                    <tr>
                        <td>{item.name}</td>
                        <td>{item.value}</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
  }
}
