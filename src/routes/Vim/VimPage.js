import React, {Component} from 'react';
import vimPic from '../../assets/images/vim.gif';
import {Row, Col} from 'antd';
class VimPage extends Component {
    render() {
        return (
            <Row>
                <Col xs={24} sm={13} md={13}>
                     <img alt="example" style={{width: '100%'}} src={vimPic}/>
                </Col>
            </Row>
        );
    }
}
export default VimPage;