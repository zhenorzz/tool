import React, {Component} from 'react';
import {Menu, Input, Select, Row, Col, Button} from 'antd';
import axios from "axios/index";

class Postman extends Component {
    constructor(pros) {
        super(pros);
    }

    state = {
        current: 'param',
        method: 'GET',
        url: 'http://localhost:3000/index/Http/show',
        inputList: [],
        urlParam: {
            key: {},
            value: {}
        },
        showResponse: false,
        showParam: true,
        response: '',
    }
    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }

    methodChange = (value) => {
        this.setState({
            method: value,
        });
    }

    urlChange = (e) => {
        this.setState({
            url: e.target.value,
        });
    }

    sendClick = (e) => {
        let params = {};
        params['method'] = this.state.method;
        params['url'] = this.state.url;
        params['urlParam'] = {};
        const paramLength = this.state.inputList.length;
        const urlParam = this.state.urlParam;
        let tempUrlParam = {};
        for (let i = 0; i <= paramLength; i++) {
            if (urlParam.key.hasOwnProperty('key' + i)) {
                let key = urlParam.key['key' + i];
                let value = '';
                if (urlParam.value.hasOwnProperty('value' + i)) {
                    value = urlParam.value['value' + i];
                }
                tempUrlParam[key] = value;
            }
        }
        params['urlParam'] = tempUrlParam;
        axios.post("/index/Http/show", params)
            .then((response) => {
                const data = JSON.stringify(response.data, null, '    ');
                this.setState({
                    current: 'response',
                    response: React.createElement('pre', null, data)
                });
                console.log(response)
            })
    }

    urlParamChange = (index, e) => {
        let urlParam = this.state.urlParam;
        if (index.substring(0, 3) === 'key') {
            urlParam.key[index] = e.target.value;
        } else {
            urlParam.value[index] = e.target.value;
        }
        this.setState({
            [index]: e.target.value,
            urlParam: urlParam,
        });
    }
    addUrlParamInput = (e) => {
        const inputList = this.state.inputList;
        inputList.push(inputList.length + 1);
        this.setState({
            inputList: inputList
        });
    }

    render() {
        const InputGroup = Input.Group;
        const Option = Select.Option;
        return (
            <div>
                <Row style={{marginTop: 16}}>
                    <Col xs={12} sm={12} md={12} lg={12}>
                        <InputGroup compact>
                            <Select size="large" defaultValue="GET" onChange={this.methodChange}>
                                <Option value="GET">GET</Option>
                                <Option value="POST">POST</Option>
                                <Option value="PUT">PUT</Option>
                                <Option value="DELETE">DELETE</Option>
                            </Select>
                            <Input
                                size="large"
                                style={{width: '80%'}}
                                placeholder="http(s)://"
                                value={this.state.url}
                                onChange={this.urlChange}
                            />
                        </InputGroup>
                    </Col>
                    <Col xs={8} sm={8} md={8} lg={8}>
                        <Button
                            size="large"
                            type="primary"
                            icon="rocket"
                            style={{marginRight: 10}}
                            onClick={this.sendClick}
                        >
                            发送
                        </Button>
                        <Button size="large" type="primary" icon="copy">
                            保存
                        </Button>
                    </Col>
                </Row>
                <Menu
                    onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                >
                    <Menu.Item key="param">
                        URL Params
                    </Menu.Item>
                    <Menu.Item key="body">
                        Request Body
                    </Menu.Item>
                    <Menu.Item key="header">
                        Request Header
                    </Menu.Item>
                    <Menu.Item key="response">
                        Response
                    </Menu.Item>
                </Menu>
                {
                    this.state.current === 'param' && <Row style={{marginTop: 16}}>
                        <Col xs={6} sm={6} md={6} lg={6} style={{marginRight: 6}}>
                            <div style={{marginBottom: 16}}>
                                <Input addonBefore="Key:"
                                       value={this.state['key0']}
                                       onChange={this.urlParamChange.bind(this, 'key0')}
                                />
                            </div>
                        </Col>
                        <Col xs={6} sm={6} md={6} lg={6} style={{marginRight: 6}}>
                            <div style={{marginBottom: 16}}>
                                <Input addonBefore="Value:"
                                       value={this.state['value0']}
                                       onChange={this.urlParamChange.bind(this, 'value0')}
                                />
                            </div>
                        </Col>
                        <Col xs={3} sm={3} md={3} lg={3}>
                            <Button type="primary" icon="plus" onClick={this.addUrlParamInput}>
                                添加
                            </Button>
                        </Col>
                    </Row>
                }

                {
                    this.state.current === 'param' && this.state.inputList.map((input, index) => {
                        return (<Row key={index}>
                            <Col xs={6} sm={6} md={6} lg={6} style={{marginRight: 6}}>
                                <div style={{marginBottom: 16}}>
                                    <Input addonBefore="Key:"
                                           value={this.state['key' + input]}
                                           onChange={this.urlParamChange.bind(this, 'key' + input)}
                                    />
                                </div>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6} style={{marginRight: 6}}>
                                <div style={{marginBottom: 16}}>
                                    <Input addonBefore="Value:"
                                           value={this.state['value' + input]}
                                           onChange={this.urlParamChange.bind(this, 'value' + input)}
                                    />
                                </div>
                            </Col>
                        </Row>)
                    })}
                {
                    this.state.current === 'response' &&
                    <div style={{marginTop: 16, marginLeft: 6}}>
                        {this.state.response}
                    </div>
                }
            </div>
        );
    }
}

export default Postman;