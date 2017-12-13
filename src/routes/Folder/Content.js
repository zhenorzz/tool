import React, {Component} from 'react';
import {Upload, Icon, Divider, Button } from 'antd';
const ButtonGroup = Button.Group;
class FolderContent extends Component {
    render() {
        return (
            <div>
                <section id="button-section">
                <Button style={{ marginRight: 8 }}>根目录</Button>
                <Upload name="logo" listType="picture" className="inline-block" style={{ marginRight: 8 }}>
                    <Button>
                        <Icon type="upload" /> 选择要上传的文件
                    </Button>
                </Upload>
                <Button icon="folder-add" style={{ marginRight: 8 }}>
                   新建文件夹
                </Button>
                <ButtonGroup style={{ marginRight: 8 }}>
                    <Button icon="download" />
                    <Button icon="qrcode" />
                    <Button icon="eye" />
                    <Button icon="delete" />
                </ButtonGroup>
                </section>
                <Divider />
            </div>
        );
    }
}

export default FolderContent;