import React, {Component} from 'react';
import {Upload, Icon, Divider, Button, Row, Col, Modal, Input} from 'antd';
import axios from 'axios';

class FolderContent extends Component {
    constructor(pros) {
        super(pros);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.cleanFileButton = this.cleanFileButton.bind(this);
    }

    state = {
        file: [],
        dir: [],
        folder: ['根目录'],
        fileList: [],
        fileClick: false,
        fileIndex: -1,
        loading: false,
        visible: false,
        createErrorMsg: '',
        createFileName: '',
    };

    componentDidMount() {
        document.onclick = this.cleanFileButton;
        axios.get('/index/Index/read', {params: {path: ''}})
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
    //清除文件按钮
    cleanFileButton() {
        this.setState({
            fileClick: false,
            fileIndex: -1,
        });
    }
    //点击目录
    handleDirClick(item, index, event) {
        let folders = this.state.folder;
        folders = folders.slice(0, index + 1);
        this.setState({
            folder: folders,
        });
        let path = '';
        for (let i = 1; i < folders.length; i++) {
            path += folders[i] + '/'
        }
        axios.get('/index/Index/read', {params: {path: path}})
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
    //点击文件
    handleFileClick(item, index, e) {
        e.nativeEvent.stopImmediatePropagation();
        this.setState({
            fileClick: true,
            fileIndex: index,
        });
    }
    //点击目录导航
    handleFolderClick(item) {
        let folders = this.state.folder;
        folders.push(item);
        this.setState({
            folder: folders,
        });
        let path = '';
        for (let i = 1; i < folders.length; i++) {
            path += folders[i] + '/'
        }
        axios.get('/index/Index/read', {params: {path: path}})
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
    //上传文件
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
    //创建文件夹开始
    handleOk = () => {
        if (this.state.createFileName.trim() === '') {
            this.setState({
                createErrorMsg: '文件夹名字不能为空',
                createFileName: '',
            });
        } else {
            this.setState({loading: true});
            let folders = this.state.folder;
            let path = '';
            for (let i = 1; i < folders.length; i++) {
                path += folders[i] + '/'
            }
            axios.post('/index/Index/create', {
                dir: path,
                name: this.state.createFileName
            })
                .then((response) => {
                    let result = JSON.parse(response.request.response);
                    if (result.hasOwnProperty('createResult') && result.createResult === true) {
                        let dirs = this.state.dir;
                        dirs.push(this.state.createFileName);
                        this.setState({
                            loading: false,
                            visible: false,
                            dir: dirs,
                            createFileName: '',
                            createErrorMsg: '',
                        });
                    } else {
                        this.setState({
                            loading: false,
                            createErrorMsg: result.errorMsg,
                        });
                    }

                })
                .catch(() => {
                    this.setState({loading: false, visible: false});
                })
        }
    }
    handleCancel = () => {
        this.setState({visible: false});
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    createNameChange = (e) => {
        this.setState({createFileName: e.target.value});
    }
    //创建文件夹结束
    render() {
        const ButtonGroup = Button.Group;
        let folders = this.state.folder;
        let path = '';
        for (let i = 1; i < folders.length; i++) {
            path += folders[i] + '/'
        }
        const props = {
            action: '/index/Index/upload?path=' + path,
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
                                            onClick={this.handleDirClick.bind(this, item, index)}>{item}</Button>
                                )
                            })
                        }
                    </ButtonGroup>

                    <Upload {...props} fileList={this.state.fileList} className="inline-block" style={{marginRight: 8}}>
                        <Button>
                            <Icon type="upload"/> 选择要上传的文件
                        </Button>
                    </Upload>
                    <Button icon="folder-add" style={{marginRight: 8}} onClick={this.showModal}>
                        新建文件夹
                    </Button>
                    <Modal
                        visible={this.state.visible}
                        title="输入文件夹名字"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <span key="info" style={{
                                color: 'red',
                                fontSize: '12px',
                                marginRight: '10px'
                            }}>{this.state.createErrorMsg}</span>,
                            <Button key="back" onClick={this.handleCancel}>返回</Button>,
                            <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>
                                创建
                            </Button>,
                        ]}
                    >
                        <Input placeholder="输入文件夹名字" value={this.state.createFileName}
                               onChange={this.createNameChange}/>
                    </Modal>
                    {this.state.fileClick &&
                    <ButtonGroup style={{marginRight: 8}}>
                        <Button icon="download"/>
                        <Button icon="qrcode"/>
                        <Button icon="eye"/>
                        <Button icon="delete"/>
                    </ButtonGroup>
                    }
                </section>
                <Divider/>
                <Row>
                    {
                        this.state.dir.map((item, index) => {
                            return (
                                <Col xs={12} sm={6} md={4} lg={2} key={index} style={{cursor: 'pointer'}}
                                     onClick={this.handleFolderClick.bind(this, item)}>
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
                                <Col xs={12} sm={6} md={4} lg={2} key={index} style={{cursor: 'pointer'}}
                                     onClick={this.handleFileClick.bind(this, item, index)}>
                                    <div style={{textAlign: 'center'}}>
                                        <img alt={item} width="64"
                                             src={require('../../assets/images/' + suffix + '.png')}/>
                                        <div
                                            style={{color: this.state.fileIndex === index ? '#40a9ff' : 'rgba(0, 0, 0, 0.65)'}}>{item}</div>
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