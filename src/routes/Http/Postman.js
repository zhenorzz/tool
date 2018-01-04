import React, {Component} from 'react';
import {Menu, Input, Select, Row, Col, Button, Radio} from 'antd';
import axios from "axios/index";

class Postman extends Component {

    state = {
        current: 'param',
        method: 'GET',
        url: '',
        inputUrlParamList: [0],
        inputBodyParamList: [0],
        inputHeaderParamList: [0],
        urlParam: {
            key: {},
            value: {}
        },
        bodyParam: {
            key: {},
            value: {}
        },
        headerParam: {
            key: {},
            value: {}
        },
        xmlParam: '',
        showResponse: false,
        showParam: true,
        response: '',
        radio: 'application/x-www-form-urlencoded',
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
    xmlChange = (e) => {
        this.setState({
            xmlParam: e.target.value,
        });
    }
    sendClick = (e) => {
        let params = {};
        params['method'] = this.state.method;
        params['url'] = this.state.url;
        params['contentType'] = this.state.radio;
        //url param
        let paramLength = this.state.inputUrlParamList.length;
        let param = this.state.urlParam;
        let tempParam = {};
        for (let i = 0; i <= paramLength; i++) {
            if (param.key.hasOwnProperty('keyUrl' + i)) {
                let key = param.key['keyUrl' + i];
                let value = '';
                if (param.value.hasOwnProperty('valueUrl' + i)) {
                    value = param.value['valueUrl' + i];
                }
                tempParam[key] = value;
            }
        }
        params['urlParam'] = tempParam;

        // body param
        if (this.state.method === 'GET') {
            params['bodyParam'] = {};
        } else if (this.state.radio === 'application/xml') {
            params['bodyParam'] = this.state.xmlParam;
        } else {
            paramLength = this.state.inputBodyParamList.length;
            param = this.state.bodyParam;
            tempParam = {};
            for (let i = 0; i <= paramLength; i++) {
                if (param.key.hasOwnProperty('keyBody' + i)) {
                    let key = param.key['keyBody' + i];
                    let value = '';
                    if (param.value.hasOwnProperty('valueBody' + i)) {
                        value = param.value['valueBody' + i];
                    }
                    tempParam[key] = value;
                }
            }
            params['bodyParam'] = tempParam;
        }
        // header param
        paramLength = this.state.inputHeaderParamList.length;
        param = this.state.headerParam;
        tempParam = {};
        for (let i = 0; i <= paramLength; i++) {
            if (param.key.hasOwnProperty('keyHeader' + i)) {
                let key = param.key['keyHeader' + i];
                let value = '';
                if (param.value.hasOwnProperty('valueHeader' + i)) {
                    value = param.value['valueHeader' + i];
                }
                tempParam[key] = value;
            }
        }
        if (this.state.method !== 'GET') {
            tempParam['Content-Type'] = this.state.radio + ';charset=utf-8';
        }
        params['headerParam'] = tempParam;


        axios.post("/index/Http/show", params)
            .then((response) => {
                const data = response.data;
                const contentType = data.contentType;
                let insideData;
                switch (contentType) {
                    case 'application/xml':
                    case 'text/plain':
                        insideData = data.body;
                        break;
                    case 'text/html':
                        insideData = <div dangerouslySetInnerHTML={{__html: data.body}}></div>;
                        break;
                    case 'application/json':
                        insideData = JSON.parse(data.body);
                        insideData = React.createElement('pre', null, JSON.stringify(insideData, null, '    '))
                        break;
                    default:
                        insideData = '';
                }
                this.setState({
                    current: 'response',
                    response: insideData
                });
            })
            .catch((error) => {
                console.log(error)
            })
    }

    paramChange = (key, index, e) => {
        const param = this.state[key];
        if (index.substring(0, 3) === 'key') {
            param.key[index] = e.target.value;
        } else {
            param.value[index] = e.target.value;
        }
        this.setState({
            [index]: e.target.value,
            [key]: param,
        });
    }
    addInput = (key, e) => {
        const inputList = this.state[key];
        inputList.push(inputList.length);
        this.setState({
            [key]: inputList
        });
    }
    radioChange = (e) => {
        this.setState({
            radio: e.target.value,
        });
    }

    selectHeader = (key, index, value) => {
        const param = this.state[key];
        param.key[index] = value;
        this.setState({
            [index]: value,
            [key]: param,
        });
    }

    render() {
        const InputGroup = Input.Group;
        const Option = Select.Option;
        const RadioGroup = Radio.Group;
        const {TextArea} = Input;
        const Header = [
            'Content-Type',
            'Accept',
            'Accept-Language',
            'Accept-Encoding',
            'Accept-Charset',
            'cookie',
            'User-Agent',
            'Referer',
        ];
        const children = [];
        for (let i = 0; i < Header.length; i++) {
            children.push(<Option key={Header[i]}>{Header[i]}</Option>);
        }
        return (
            <div>
                {/*Header*/}
                <Row style={{marginTop: 16}}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <InputGroup compact>
                            <Select style={{width: '25%'}}
                                    size="large"
                                    defaultValue="GET"
                                    onChange={this.methodChange}>
                                <Option value="GET">GET</Option>
                                <Option value="POST">POST</Option>
                                <Option value="PUT">PUT</Option>
                                <Option value="DELETE">DELETE</Option>
                            </Select>
                            <Input
                                size="large"
                                style={{width: '75%'}}
                                placeholder="http(s)://"
                                value={this.state.url}
                                onChange={this.urlChange}
                            />
                        </InputGroup>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <Button
                            size="large"
                            type="primary"
                            icon="rocket"
                            style={{marginLeft: 10, marginRight: 10}}
                            onClick={this.sendClick}
                        >
                            发送
                        </Button>
                        <Button size="large" type="primary" icon="copy">
                            保存
                        </Button>
                    </Col>
                </Row>
                {/*Menu*/}
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
                    //additional input
                    this.state.current === 'param' &&
                    this.state.inputUrlParamList.map((input, index) => {
                        return (
                            <Row key={index} style={index === 0 ? {marginTop: 16} : {}}>
                                <Col xs={6} sm={6} md={6} lg={6} style={{marginRight: 6}}>
                                    <div style={{marginBottom: 16}}>
                                        <Input addonBefore="Key:"
                                               value={this.state['keyUrl' + input]}
                                               onChange={this.paramChange.bind(this, 'urlParam', 'keyUrl' + input)}
                                        />
                                    </div>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6} style={{marginRight: 6}}>
                                    <div style={{marginBottom: 16}}>
                                        <Input addonBefore="Value:"
                                               value={this.state['valueUrl' + input]}
                                               onChange={this.paramChange.bind(this, 'urlParam', 'valueUrl' + input)}
                                        />
                                    </div>
                                </Col>
                                {
                                    index === 0 &&
                                    <Col xs={3} sm={3} md={3} lg={3}>
                                        <Button type="primary" icon="plus"
                                                onClick={this.addInput.bind(this, 'inputUrlParamList')}>
                                            添加
                                        </Button>
                                    </Col>
                                }
                            </Row>
                        )
                    })
                }

                {
                    //request radio
                    this.state.current === 'body' &&
                    <RadioGroup onChange={this.radioChange} value={this.state.radio}
                                style={{marginTop: 16, marginLeft: 6}}>
                        <Radio value={"application/x-www-form-urlencoded"}>application/x-www-form-urlencoded</Radio>
                        <Radio value={"application/json"}>application/json</Radio>
                        <Radio value={"application/xml"}>application/xml</Radio>
                    </RadioGroup>
                }

                {
                    this.state.current === 'body' &&
                    this.state.radio !== 'application/xml' &&
                    this.state.inputBodyParamList.map((input, index) => {
                        return (
                            <Row key={index} style={index === 0 ? {marginTop: 16} : {}}>
                                <Col xs={6} sm={6} md={6} lg={6} style={{marginRight: 6}}>
                                    <div style={{marginBottom: 16}}>
                                        <Input addonBefore="Key:"
                                               value={this.state['keyBody' + input]}
                                               onChange={this.paramChange.bind(this, 'bodyParam', 'keyBody' + input)}
                                        />
                                    </div>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6} style={{marginRight: 6}}>
                                    <div style={{marginBottom: 16}}>
                                        <Input addonBefore="Value:"
                                               value={this.state['valueBody' + input]}
                                               onChange={this.paramChange.bind(this, 'bodyParam', 'valueBody' + input)}
                                        />
                                    </div>
                                </Col>
                                {
                                    index === 0 &&
                                    <Col xs={3} sm={3} md={3} lg={3}>
                                        <Button type="primary" icon="plus"
                                                onClick={this.addInput.bind(this, 'inputBodyParamList')}>
                                            添加
                                        </Button>
                                    </Col>
                                }
                            </Row>
                        )
                    })
                }
                {
                    this.state.current === 'body' &&
                    this.state.radio === 'application/xml' &&
                    <Row style={{marginTop: 16}}>
                        <Col xs={12} sm={12} md={12} lg={12} style={{marginRight: 6}}>
                            <div style={{marginBottom: 16}}>
                                <TextArea
                                    placeholder="输入XML文本"
                                    autosize={{minRows: 6}}
                                    onChange={this.xmlChange}
                                />
                            </div>
                        </Col>
                    </Row>
                }
                {
                    this.state.current === 'header' &&
                    this.state.inputHeaderParamList.map((input, index) => {
                        return (
                            <Row key={index} style={{marginTop: 16}}>
                                <Col xs={12} sm={12} md={12} lg={12} style={{marginRight: 6}}>
                                    <InputGroup compact>
                                        <Select
                                            mode="combobox"
                                            placeholder="Content-Type"
                                            style={{width: '35%'}}
                                            value={this.state['keyHeader' + input]}
                                            onChange={this.selectHeader.bind(this, 'headerParam', 'keyHeader' + input)}
                                        >
                                            {children}
                                        </Select>
                                        <Input
                                            placeholder="application/json"
                                            style={{width: '65%'}}
                                            value={this.state['valueHeader' + input]}
                                            onChange={this.paramChange.bind(this, 'headerParam', 'valueHeader' + input)}
                                        />
                                    </InputGroup>
                                </Col>
                                {
                                    index === 0 &&
                                    <Col xs={3} sm={3} md={3} lg={3}>
                                        <Button
                                            type="primary" icon="plus"
                                            onClick={this.addInput.bind(this, 'inputHeaderParamList')}>
                                            添加
                                        </Button>
                                    </Col>
                                }
                            </Row>
                        )
                    })
                }

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