import React, {Component} from 'react';
import {BrowserRouter, Route, Link} from 'react-router-dom';
import Folder from './routes/Folder/Content';
import JsonFormat from './routes/Json/JsonFormat';
import {Layout, Menu, Icon} from 'antd';
import logo from './assets/images/zzz.svg';

const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;

class Router extends Component {
    constructor(pros) {
        super(pros);
    }

    componentWillMount() {
    }

    render() {
        let href = window.location.href.split('/');
        href = href[3] ? href[3] : '/';
        return (
            <BrowserRouter>
                <Layout>
                    <Sider
                        collapsedWidth="0"
                        breakpoint="lg"
                        width="260"
                    >
                        <div className="logo">
                            <a href="#">
                                <img src={logo} alt="logo"/>
                                <h1>Software Kit</h1>
                            </a>
                        </div>
                        <Menu theme="dark" mode="inline" defaultSelectedKeys={[href]} defaultOpenKeys={['tool']}>
                            <Menu.Item key="/">
                                <Link to="/">
                                    <Icon type="folder"/>
                                    <span className="nav-text">目录</span>
                                </Link>
                            </Menu.Item>
                            <SubMenu key="tool" title={<span><Icon type="tool"/><span>工具</span></span>}>
                                <Menu.Item key="JsonFormat">
                                    <Link to="/JsonFormat">
                                        <Icon type="code-o"/>Json
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="qrcode">
                                    <Link to="/qrcode">
                                        <Icon type="qrcode"/> 二维码
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="http">
                                    <Link to="/http">
                                        <Icon type="link"/>Http
                                    </Link>
                                </Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{background: '#fff', padding: 0}} id="ant"/>
                        <Content style={{margin: '24px 16px 0'}}>
                            <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                                <Route exact path="/" component={Folder}/>
                                <Route exact path="/JsonFormat" component={JsonFormat}/>
                            </div>
                        </Content>
                        <Footer style={{textAlign: 'center'}}>
                            <Icon type="copyright"/>2017 Zzzzz, Inc. Licensed under apache license.
                        </Footer>
                    </Layout>
                </Layout>
            </BrowserRouter>
        );
    }
}

export default Router;