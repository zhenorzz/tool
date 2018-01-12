import React, {Component} from 'react';
import {Upload, Icon, Divider, Button, Row, Col, Modal, Popconfirm, Input, message, Spin} from 'antd';
import axios from 'axios';
import QRCode from 'qrcode.react';

class FolderContent extends Component {
    constructor(pros) {
        super(pros);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.cleanFileButton = this.cleanFileButton.bind(this);
        this.path = this.path.bind(this);
    }

    state = {
        file: [],
        dir: [],
        folder: ['根目录'],
        fileList: [],
        fileClick: false,
        fileIndex: -1,
        fileName: '',
        createFolderLoading: false,
        createFolderVisible: false,
        createErrorMsg: '',
        createFileName: '',
        createQrcodeVisible: false,
        qrcodeValue: '',
        filePreviewVisible: false,
        previewContent: '',
        fileListLoading: true,
    };

    //文件夹路径
    path() {
        let folders = this.state.folder;
        let path = '';
        for (let i = 1; i < folders.length; i++) {
            path += folders[i] + '/'
        }
        return path;
    }

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
                    fileListLoading: false
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

    //点击目录导航
    handleDirClick(item, index, event) {
        let folders = this.state.folder;
        folders = folders.slice(0, index + 1);
        this.setState({
            folder: folders,
            fileListLoading: true,
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
                    fileListLoading: false,
                });
            })
    }

    //点击文件
    handleFileClick(item, index, e) {
        e.nativeEvent.stopImmediatePropagation();
        this.setState({
            fileClick: true,
            fileIndex: index,
            fileName: item,
        });
    }

    //点击目录
    handleFolderClick(item) {
        let folders = this.state.folder;
        folders.push(item);
        this.setState({
            folder: folders,
            fileListLoading: true,
        });
        let path = this.path();
        axios.get('/index/Index/read', {params: {path: path}})
            .then((response) => {
                let data = JSON.parse(response.request.response);
                let file = data.file;
                let dir = data.dir;
                this.setState({
                    file: file ? file : [],
                    dir: dir ? dir : [],
                    fileListLoading: false,
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

    //创建文件夹
    showCreateFolderModal = () => {
        this.setState({
            createFolderVisible: true,
        });
    }
    createFolderOk = () => {
        if (this.state.createFileName.trim() === '') {
            this.setState({
                createErrorMsg: '文件夹名字不能为空',
                createFileName: '',
            });
        } else {
            this.setState({createFolderLoading: true});
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
                            createFolderLoading: false,
                            createFolderVisible: false,
                            dir: dirs,
                            createFileName: '',
                            createErrorMsg: '',
                        });
                    } else {
                        this.setState({
                            createFolderLoading: false,
                            createErrorMsg: result.errorMsg,
                        });
                    }

                })
                .catch(() => {
                    this.setState({createFolderLoading: false, createFolderVisible: false});
                })
        }
    }
    createFolderCancel = () => {
        this.setState({createFolderVisible: false});
    }
    createNameChange = (e) => {
        this.setState({createFileName: e.target.value});
    }

    //文件下载
    handleDownload = (e) => {
        e.nativeEvent.stopImmediatePropagation();
        let path = this.path();
        let file = path + this.state.fileName;
        window.open('/index/Index/download?file=' + file);
    }

    //创建二维码
    showCreateQrcodeModal = (e) => {
        e.nativeEvent.stopImmediatePropagation();
        let url = 'http://192.168.1.204:3000/index/Index/download?file=' + this.path() + this.state.fileName;
        this.setState({
            qrcodeValue: url,
            createQrcodeVisible: true,
        });
    }
    createQrcodeCancel = () => {
        this.setState({createQrcodeVisible: false});
    }

    //删除文件
    showDeleteConfirm = (e) => {
        e.nativeEvent.stopImmediatePropagation();
    }
    deleteConfirm = (e) => {
        let fileName = this.state.fileName;
        axios.delete('/index/Index/delete?file=' + this.path() + fileName)
            .then((response) => {
                let result = JSON.parse(response.request.response);
                if (result.hasOwnProperty('createResult') && result.createResult === true) {
                    let files = this.state.file;
                    let index = files.indexOf(fileName);
                    files.splice(index, 1);
                    this.setState({
                        file: files,
                    });
                    message.info('删除成功');
                } else {
                    message.error('文件不存在，删除失败');
                }
            })
            .catch(() => {
                message.error('系统错误，删除失败');
            })
    }

    //创建二维码
    showFilePreviewModal = (e) => {
        e.nativeEvent.stopImmediatePropagation();
        this.setState({
            previewContentLoading: true,
        });
        let fileName = this.state.fileName;
        axios.delete('/index/Index/preview?file=' + this.path() + fileName)
            .then((response) => {
                let html = response.request.response;
                this.setState({
                    previewContent: html,
                    filePreviewVisible: true,
                });
            })
            .catch(() => {
                message.error('系统错误，删除失败');
            })
    }
    filePreviewCancel = () => {
        this.setState({
            filePreviewVisible: false,
            previewContent: '',
        });
    }

    render() {
        const ButtonGroup = Button.Group;
        let path = this.path();
        const props = {
            action: '/index/Index/upload?path=' + path,
            multiple: true,
            onChange: this.handleFileChange,
            name: 'file',
        };
        return (
            <div>
                <section id="button-section">
                    {/*文件夹目录*/}
                    <ButtonGroup style={{marginRight: 8}}>
                        {
                            this.state.folder.map((item, index) => {
                                return (
                                    <Button key={index}
                                            onClick={this.handleDirClick.bind(this, item, index)}
                                    >{item}</Button>
                                )
                            })
                        }
                    </ButtonGroup>
                    {/*上传文件*/}
                    <Upload {...props} fileList={this.state.fileList} className="inline-block" style={{marginRight: 8}}>
                        <Button>
                            <Icon type="upload"/> 选择要上传的文件
                        </Button>
                    </Upload>
                    {/*新建文件夹*/}
                    <Button icon="folder-add" style={{marginRight: 8}} onClick={this.showCreateFolderModal}>
                        新建文件夹
                    </Button>
                    <Modal
                        visible={this.state.createFolderVisible}
                        title="输入文件夹名字"
                        onOk={this.createFolderOk}
                        onCancel={this.createFolderCancel}
                        footer={[
                            <span key="info" style={{
                                color: 'red',
                                fontSize: '12px',
                                marginRight: '10px'
                            }}>{this.state.createErrorMsg}</span>,
                            <Button key="back" onClick={this.createFolderCancel}>返回</Button>,
                            <Button key="submit" type="primary" loading={this.state.createFolderLoading}
                                    onClick={this.createFolderOk}>
                                创建
                            </Button>,
                        ]}
                    >
                        <Input placeholder="输入文件夹名字" value={this.state.createFileName}
                               onChange={this.createNameChange}/>
                    </Modal>
                    {/*新建文件夹结束*/}
                    {/*文件操作Button*/}
                    {
                        this.state.fileClick &&
                        <ButtonGroup style={{marginRight: 8}}>
                            <Button icon="download" onClick={this.handleDownload}/>
                            <Button icon="qrcode" onClick={this.showCreateQrcodeModal}/>
                            <Modal
                                visible={this.state.createQrcodeVisible}
                                title="手机扫码下载"
                                onCancel={this.createQrcodeCancel}
                                footer={null}
                            >
                                <div style={{textAlign: 'center'}}>
                                    <QRCode value={this.state.qrcodeValue} size={256} level={'H'}/>
                                </div>
                            </Modal>
                            <Button icon="eye" onClick={this.showFilePreviewModal}/>
                            <Modal
                                visible={this.state.filePreviewVisible}
                                title={this.state.fileName}
                                onCancel={this.filePreviewCancel}
                                footer={null}
                            >
                                <div dangerouslySetInnerHTML={{__html: this.state.previewContent}}/>
                            </Modal>
                            <Popconfirm placement="bottom" title="确认删除该文件？" onConfirm={this.deleteConfirm} okText="是"
                                        cancelText="否" onClick={this.showDeleteConfirm}>
                                <Button icon="delete"/>
                            </Popconfirm>

                        </ButtonGroup>
                    }
                </section>
                <Divider/>
                {/*文件操作list*/}
                <Row>
                    <Spin spinning={this.state.fileListLoading}>
                        {/*dir*/}
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
                    {/*file*/}
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
                                case 'zip':
                                    break;
                                case 'apk':
                                    break;
                                case 'xls':
                                    suffix = 'excel';
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
                    </Spin>
                </Row>
            </div>
        );
    }
}

export default FolderContent;