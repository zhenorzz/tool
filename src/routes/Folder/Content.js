import React, {Component} from 'react';
import {Upload, Icon, Divider, Button, Row, Col} from 'antd';
import axios from 'axios';

class FolderContent extends Component {
    constructor(pros) {
        super(pros);
        this.handleFileChange = this.handleFileChange.bind(this)
    }

    state = {file: [], dir: [], folder: ['根目录'],fileList:[]};

    componentDidMount() {
        axios.get('http://localhost:6324/index/Index/read', {params: {path: ''}})
            .then((response) => {
                let data = JSON.parse(response.request.response);
                let file = data.file;
                let dir = data.dir;
                this.setState({
                    file: file,
                    dir: dir,
                });
            })
    }

    handleClick(item, index, event) {
        let folders = this.state.folder;
        folders = folders.slice(0, index + 1);
        this.setState({
            folder: folders,
        });
        let path = '';
        for (let i = 1; i < folders.length; i++) {
            path += folders[i] + '/'
        }
        axios.get('http://localhost:6324/index/Index/read', {params: {path: path}})
            .then((response) => {
                let data = JSON.parse(response.request.response);
                let file = data.file;
                let dir = data.dir;
                this.setState({
                    file: file ? file : [],
                    dir: dir ? dir : [],
                });
            })
    }

    dirClick(item) {
        let folders = this.state.folder;
        folders.push(item);
        this.setState({
            folder: folders,
        });
        let path = '';
        for (let i = 1; i < folders.length; i++) {
            path += folders[i] + '/'
        }
        axios.get('http://localhost:6324/index/Index/read', {params: {path: path}})
            .then((response) => {
                let data = JSON.parse(response.request.response);
                let file = data.file;
                let dir = data.dir;
                this.setState({
                    file: file ? file : [],
                    dir: dir ? dir : [],
                });
            })
    }

    handleFileChange(info) {
        let files = this.state.file;
        let fileList = info.fileList;
        let tempList = info.fileList;
        // 1. Limit the number of uploaded files
        //    Only to show two recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-2);

        // 2. read from response and show file link
        fileList = fileList.map((file) => {
            if (file.response) {
                // Component will show file.url as link
                file.url = file.response.url;
            }
            return file;
        });

        // 3. filter successfully uploaded files according to response from server
        fileList = fileList.filter((file) => {
            if (file.response) {
                return file.response.status === 'success';
            }
            return true;
        });

        tempList.map((file) => {
            if (file.status === 'done') {
                files.includes(file.name) || files.push(file.name)
            }
            return true;
        });

        this.setState({
            file: files,
            fileList: fileList
        });
    }

    render() {
        const ButtonGroup = Button.Group;
        let folders = this.state.folder;
        let path = '';
        for (let i = 1; i < folders.length; i++) {
            path += folders[i] + '/'
        }
        const props = {
            action: 'http://localhost:6324/index/Index/upload?path=' + path,
            multiple: true,
            onChange: this.handleFileChange,
            name: 'file',
        };
        return (
            <div>
                <section id="button-section">
                    <ButtonGroup style={{marginRight: 8}}>
                        {
                            this.state.folder.map((item, index) => {
                                return (
                                    <Button key={index}
                                            onClick={this.handleClick.bind(this, item, index)}>{item}</Button>
                                )
                            })
                        }
                    </ButtonGroup>

                    <Upload {...props} fileList={this.state.fileList} className="inline-block" style={{marginRight: 8}}>
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
                <Row>
                    {
                        this.state.dir.map((item, index) => {
                            return (
                                <Col xs={12} sm={6} md={4} lg={2} key={index} style={{cursor:'pointer'}} onClick={this.dirClick.bind(this, item)}>
                                    <div style={{textAlign: 'center'}}>
                                        <img alt={item} width="64" src={require('../../assets/images/folder.png')}/>
                                        <div>{item}</div>
                                    </div>
                                </Col>
                            )
                        })
                    }
                    {
                        this.state.file.map((item, index) => {
                            let suffix = item.substr(item.lastIndexOf(".") + 1);
                            switch (suffix) {
                                case 'txt':
                                    break;
                                case 'html':
                                    break;
                                case 'md':
                                    suffix = 'markdown';
                                    break;
                                case 'pdf':
                                    break;
                                default:
                                    suffix = 'unknown';
                            }
                            return (
                                <Col xs={12} sm={6} md={4} lg={2} key={index} style={{cursor:'pointer'}}>
                                    <div style={{textAlign: 'center'}}>
                                        <img alt={item} width="64"
                                             src={require('../../assets/images/' + suffix + '.png')}/>
                                        <div>{item}</div>
                                    </div>
                                </Col>
                            )
                        })
                    }
                </Row>
            </div>
        );
    }
}

export default FolderContent;