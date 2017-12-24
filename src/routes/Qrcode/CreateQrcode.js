import React, {Component} from 'react';
import {Row, Col, Input, Upload, Icon, Modal, Button, message} from 'antd';
import axios from "axios/index";

class CreateQrcode extends Component {
    constructor(pros) {
        super(pros);
    }

    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
        qrcodeContent: '',
        qrcodeLogo: '',
        qrcodeImg: require('../../assets/images/logo.png')
    };
    handleCancel = () => this.setState({previewVisible: false})

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = ({file, fileList}) => {
        switch (file.status) {
            case 'uploading':
                this.setState({fileList})
                break;
            case 'done':
                this.setState({
                    fileList,
                    qrcodeLogo: file.response
                })
                break;
            case 'error':
                message.error(file.response);
                this.setState({
                    fileList: [],
                })
                break;
            case 'removed':
                this.setState({
                    fileList: [],
                })
                break;
            default:
                this.setState({
                    fileList: [],
                })
        }
    }
    handleContentChange = (e) => {
        this.setState({
            qrcodeContent: e.target.value
        })
    }
    createQrcode = () => {
        const { fileList } = this.state;
        axios.post("/index/Qrcode/create",{
            qrcodeContent: this.state.qrcodeContent,
            qrcodeLogo: this.state.qrcodeLogo,
        })
            .then((response)=>{
                this.setState({
                    qrcodeImg: response.data
                })
            })
    }
    render() {
        const {previewVisible, previewImage, fileList, qrcodeContent, qrcodeImg} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">请先输入文本再上传logo</div>
            </div>
        );
        const {TextArea} = Input;
        return (
            <div className="clearfix">
                <Row>
                    <Col xs={10} sm={10} md={10} offset={3}>
                        <TextArea
                            placeholder="输入二维码文字"
                            autosize={{minRows: 4.5, maxRows: 4.5}}
                            value={qrcodeContent}
                            onChange={this.handleContentChange}
                        />
                        <p style={{textAlign: 'center', marginTop: 10}}>
                            <Button
                                type="primary"
                                onClick={this.createQrcode}
                                disabled={this.state.qrcodeContent.length !== 0 ? false : true}
                            >
                                生成二维码
                            </Button>
                        </p>
                    </Col>
                    <Col xs={4} sm={5} md={4}>
                        <Upload
                            action="/index/Qrcode/logoPreview"
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={this.handlePreview}
                            onChange={this.handleChange}
                        >
                            {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                            <img alt="example" style={{width: '100%'}} src={previewImage}/>
                        </Modal>
                    </Col>
                    <Col xs={10} sm={6} md={3}>
                        <img alt="qrcode" src={qrcodeImg} style={{maxWidth: '100%', height: 'auto'}}/>
                        <p style={{textAlign: 'center', marginTop: 10}}>
                            <Button href={qrcodeImg} download="qrcode.png" type="primary">下载二维码</Button>
                        </p>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default CreateQrcode;