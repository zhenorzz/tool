import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import Folder from './routes/Folder/Content';
import { Layout, Menu, Icon } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
class Router extends Component {
    handleClick = (e) => {
        console.log('click ', e);
    }
    render() {
        return (
            <BrowserRouter>
                <Layout>
                    <Sider
                        breakpoint="lg"
                        collapsedWidth="0"
                        onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
                    >
                        <div className="logo" />
                        <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']} onClick={this.handleClick}>
                            <Menu.Item key="1">
                                <Icon type="user" />
                                <span className="nav-text">nav 1</span>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Icon type="video-camera" />
                                <span className="nav-text">nav 2</span>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Icon type="upload" />
                                <span className="nav-text">nav 3</span>
                            </Menu.Item>
                            <Menu.Item key="4">
                                <Icon type="user" />
                                <span className="nav-text">nav 4</span>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{ background: '#fff', padding: 0 }} />
                        <Content style={{ margin: '24px 16px 0' }}>
                            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                                <Route exact path="/" component={Folder}/>
                            </div>
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>
                            Ant Design ©2016 Created by Ant UED
                        </Footer>
                    </Layout>
                </Layout>
            </BrowserRouter>
        );
    }
}

export default Router;