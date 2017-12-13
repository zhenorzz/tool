import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import Folder from './routes/Folder/Content';
import {Layout, Menu, Icon} from 'antd';

const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;

class Router extends Component {
    state = {
        collapsed: false,
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    handleClick = (e) => {
        console.log('click ', e);
    }

    render() {
        return (
            <BrowserRouter>
                <Layout>
                    <Sider
                        trigger={null}
                        collapsedWidth="0"
                        breakpoint="lg"
                        collapsed={this.state.collapsed}
                        width="260"
                    >
                        <div className="logo"/>
                        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']}
                              onClick={this.handleClick}>
                            <Menu.Item key="1">
                                <Icon type="folder"/>
                                <span className="nav-text">目录</span>
                            </Menu.Item>
                            <SubMenu key="sub1" title={<span><Icon type="tool"/><span>工具</span></span>}>
                                <Menu.Item key="2"><Icon type="code-o"/>Json</Menu.Item>
                                <Menu.Item key="3"><Icon type="qrcode"/>二维码</Menu.Item>
                                <Menu.Item key="4"><Icon type="link"/>Http</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{background: '#fff', padding: 0}} id="ant">
                            <Icon
                                className="trigger"
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                            />
                        </Header>
                        <Content style={{margin: '24px 16px 0'}}>
                            <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                                <Route exact path="/" component={Folder}/>
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