import React, { Component } from 'react';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [], Abc: [] }
    }

    componentDidMount() {
        this.refreshData();
    }

    //API call functions

    getData(apiRoute, type) {
        fetch(apiRoute)
            .then(Response => {
                if (Response.ok) {
                    return Response.json();
                }
                throw Response;
            })
            .then(data => {
                if (type === 'get') {
                    data = data.map(item => {
                        item.indexName = item.name;
                        return item;
                    });
                    this.setState({ data: data })
                } else if (type === 'abc') {
                    this.setState({ Abc: data })
                }
            });
    }

    updateEmployee = (name, newName, value) => {
        const data = {
            name: name, newName: newName, value: value
        }

        const payload = {
            method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' }
        }
        fetch('Employees/AmendEmployee', payload)
            .then(Response => {
                if (Response.ok) {
                    this.refreshData();
                    return Response;
                }
            });
    }

    addToValue = () => {
        const payload = { method: 'PATCH' }
        fetch('/Employees/AddToValue', payload)
            .then(Response => {
                if (Response.ok) {
                    this.refreshData();
                    return Response;
                }
                throw Response;
            });
    }


    //Refresh data of both tables
    refreshData = () => {
        this.getData('/Employees/Get', 'get')
        this.getData('/Employees/GetABC', 'abc');
    }

    //Handlers for input field changes
    changeNameHandler = (index, value) => {
        this.setState((state) => {
            const items = [...this.state.data];
            items[index].name = value;
            return { data: items }
        });
    }

    changeValueHandler = (index, value) => {
        this.setState((state) => {
            const items = [...this.state.data];
            items[index].value = value;
            return { data: items }
        });
    }

    render() {
        return (
            <>
                <button key='btn_AddToValue' onClick={this.addToValue}>AddToValue</button>
                <div>
                    <table style={{ float: "left" }} key='tbl_Data' className='table table-striped' aria-labelledby="tabelLabel">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map((item, index) =>
                                <tr key={index}>
                                    <td><input value={item.name || ''} onChange={(e) => this.changeNameHandler(index, e.target.value)} onBlur={(e) => this.updateEmployee(item.indexName, e.target.value, item.value)} /></td>
                                    <td><input value={item.value || ''} onChange={(e) => this.changeValueHandler(index, e.target.value)} onBlur={(e) => this.updateEmployee(item.indexName, item.name, e.target.value)} /></td>
                                </tr>
                            )}
                            <tr>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                    <table style={{ float: "left" }} key='tbl_ABC' className='table table-striped' aria-labelledby="tabelLabel">
                        <thead>
                            <tr>
                                <th>Letter</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.Abc.map(item =>
                                <tr key={item.letter}>
                                    <td>{item.letter}</td>
                                    <td>{item.value}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}
