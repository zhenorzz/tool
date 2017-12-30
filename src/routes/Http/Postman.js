import React, {Component} from 'react';
import {Menu, Input, Select, Row, Col, Button} from 'antd';

class Postman extends Component {
    constructor(pros) {
        super(pros);
    }

    state = {
        current: 'param',
        method: 'GET',
        url: '',
        inputList:[],
    }
    handleClick = (e) => {
        console.log('click ', e);
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
        console.log(this.state)
    }

    urlParamChange= (index, e) => {
        this.setState({
            text: e.target.value,
        });
        console.log(index);
    }
    addUrlParamInput = (e) => {
        const inputList = this.state.inputList;
        inputList.push(inputList.length+1);
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
                <Row style={{marginTop: 16}}>
                    <Col xs={6} sm={6} md={6} lg={6} style={{marginRight: 6}}>
                        <div style={{marginBottom: 16}}>
                            <Input addonBefore="Key:" onChange={this.urlParamChange.bind(this, 'key0')}/>
                        </div>
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6} style={{marginRight: 6}}>
                        <div style={{marginBottom: 16}}>
                            <Input addonBefore="Value:" onChange={this.urlParamChange.bind(this, 'value0')}/>
                        </div>
                    </Col>
                    <Col xs={3} sm={3} md={3} lg={3}>
                        <Button type="primary" icon="plus" onClick={this.addUrlParamInput}>
                            添加
                        </Button>
                    </Col>
                </Row>
                {this.state.inputList.map((input, index) => {
                    return (<Row key={index}>
                        <Col xs={6} sm={6} md={6} lg={6} style={{marginRight: 6}}>
                            <div style={{marginBottom: 16}}>
                                <Input addonBefore="Key:" onChange={this.urlParamChange.bind(this, 'key'+input)}/>
                            </div>
                        </Col>
                        <Col xs={6} sm={6} md={6} lg={6} style={{marginRight: 6}}>
                            <div style={{marginBottom: 16}}>
                                <Input addonBefore="Value:" onChange={this.urlParamChange.bind(this, 'value'+input)} />
                            </div>
                        </Col>
                    </Row>)
                })}
            </div>
        );
    }
}

export default Postman;