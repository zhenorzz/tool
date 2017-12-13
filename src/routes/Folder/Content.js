import React, {Component} from 'react';
import {Upload, Icon, Divider, Button, Row, Col} from 'antd';
import axios from 'axios';

const ButtonGroup = Button.Group;

class FolderContent extends Component {
    constructor(props) {
        super(props);
        this.state = {file: [], dir: []};
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = (e) => {
        let me = this;
        axios.get('http://192.168.3.65:6324/index/Index/read?path=')
            .then(function (response) {
                let data = JSON.parse(response.request.response);
                let file = data.file;
                let dir = data.dir;
                me.setState({
                    file: file,
                    dir: dir,
                });
                console.log(JSON.parse(response.request.response));
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <div>
                <section id="button-section">
                    <Button style={{marginRight: 8}} onClick={this.handleClick}>根目录</Button>
                    <Upload name="logo" listType="picture" className="inline-block" style={{marginRight: 8}}>
                        <Button>
                            <Icon type="upload"/> 选择要上传的文件
                        </Button>
                    </Upload>
                    <Button icon="folder-add" style={{marginRight: 8}}>
                        新建文件夹
                    </Button>
                    <ButtonGroup style={{marginRight: 8}}>
                        <Button icon="download"/>
                        <Button icon="qrcode"/>
                        <Button icon="eye"/>
                        <Button icon="delete"/>
                    </ButtonGroup>
                </section>
                <Divider/>
                <div>
                    <Row>
                        {
                            this.state.dir.map((item, index) => {
                                return (
                                    <Col xs={6} sm={6} md={4} lg={2}>
                                        <div style={{cursor: "pointer"}}>
                                            <img alt="example" style={{width: '100%'}}
                                                 src={require('../../assets/images/folder.png')}/>
                                            <div style={{textAlign: 'center'}}> {item}</div>
                                        </div>
                                    </Col>
                                )
                            })
                        }
                        {
                            this.state.file.map((item, index) => {
                                return (
                                    <Col xs={6} sm={6} md={4} lg={2} key={index}>
                                        <div style={{cursor: "pointer"}}>
                                            <img alt="example" style={{width: '100%'}}
                                                 src={require('../../assets/images/folder.png')}/>
                                            <div style={{textAlign: 'center'}}> {item}</div>
                                        </div>
                                    </Col>
                                )
                            })
                        }

                        {/*<Col xs={6} sm={6} md={4} lg={2}>*/}
                            {/*<div style={{cursor: "pointer"}}>*/}
                                {/*<img alt="example" style={{width: '100%'}}*/}
                                     {/*src={require('../../assets/images/folder.png')}/>*/}
                                {/*<div style={{textAlign: 'center'}}> qrmaster</div>*/}
                            {/*</div>*/}
                        {/*</Col>*/}
                    </Row>
                </div>
            </div>
        );
    }
}

export default FolderContent;