import React, {Component} from 'react';
import {Row, Col, Input, Upload, Icon, Modal, Button} from 'antd';

class CreateQrcode extends Component {
    constructor(pros) {
        super(pros);
    }
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
    };
    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = ({ fileList }) => this.setState({ fileList })
    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Logo</div>
            </div>
        );
        const { TextArea } = Input;
        return (
            <div className="clearfix">
                <Row>
                    <Col xs={10} sm={10} md={10} offset={3}>
                        <TextArea placeholder="输入二维码文字" autosize={{ minRows: 4.5, maxRows: 4.5 }} />
                        <p style={{textAlign: 'center',marginTop:10}}><Button type="primary">生成二维码</Button></p>
                    </Col>
                    <Col xs={4} sm={5} md={4}>
                        <Upload
                            action="//jsonplaceholder.typicode.com/posts/"
                            listType="picture-card"
                            onPreview={this.handlePreview}
                            onChange={this.handleChange}
                        >
                            {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    </Col>
                    <Col xs={10} sm={6} md={3}>
                        <img src={require('../../assets/images/logo.png')} style={{maxWidth: '100%',height: 'auto'}}/>
                        <p style={{textAlign: 'center',marginTop:10}}>
                            <Button type="primary">下载二维码</Button>
                        </p>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default CreateQrcode;