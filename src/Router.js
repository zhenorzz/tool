import React, {Component} from 'react';
import {BrowserRouter, Route, Link} from 'react-router-dom';
import Folder from './routes/Folder/Content';
import JsonFormat from './routes/Json/JsonFormat';
import CreateQrcode from './routes/Qrcode/CreateQrcode';
import Postman from './routes/Http/Postman';
import VimPage from './routes/Vim/VimPage';
import {Layout, Menu, Icon, Button} from 'antd';
import logo from './assets/images/zzz.svg';

const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;

class Router extends Component {
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
                            <a href="/">
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
                                <Menu.Item key="CreateQrcode">
                                    <Link to="/CreateQrcode">
                                        <Icon type="qrcode"/> 二维码
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="Postman">
                                    <Link to="/Postman">
                                        <Icon type="link"/>Http
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="VimPage">
                                    <Link to="/VimPage">
                                        <Icon type="copy"/>Vim速查
                                    </Link>
                                </Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{background: '#fff', textAlign: 'right'}} id="ant">
                            click here to get source: <Button shape="circle" icon="github" href="https://github.com/zhenorzz/tool" />
                        </Header>
                        <Content style={{margin: '24px 16px 0'}}>
                            <div style={{padding: 24, background: '#fff', minHeight: 796}}>
                                <Route exact path="/" component={Folder}/>
                                <Route exact path="/JsonFormat" component={JsonFormat}/>
                                <Route exact path="/CreateQrcode" component={CreateQrcode}/>
                                <Route exact path="/Postman" component={Postman}/>
                                <Route exact path="/VimPage" component={VimPage}/>
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