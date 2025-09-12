import { Navigate, NavLink, Outlet } from "react-router-dom"
import { useAuthStore } from "../store";
import { Layout, Menu, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { useState } from "react";
import { GiftOutlined, HomeOutlined, ProductOutlined, ReadOutlined, UserOutlined } from '@ant-design/icons';

const Dashboard = () => {
  const items = [
    {
        key: '/',
        icon: <HomeOutlined />,
        label: <NavLink to="/">Home</NavLink>,
    },
    {
        key: '/users',
        icon: <UserOutlined />,
        label: <NavLink to="/users">Users</NavLink>,
    },
    {
        key: '/restaurants',
        icon: <ReadOutlined />,
        label: <NavLink to="/restaurants">Restaurants</NavLink>,
    },
    {
        key: '/products',
        icon: <ProductOutlined />,
        label: <NavLink to="/products">Products</NavLink>,
    },
    {
        key: '/promos',
        icon: <GiftOutlined />,
        label: <NavLink to="/promos">Promos</NavLink>,
    },
];
   const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

   const { user } = useAuthStore();
    if (user === null) {
        return <Navigate to="/auth/login" replace={true} />;
    }
  return (
    <div>
       <Layout style={{ minHeight: '100vh', background: colorBgContainer }}>
                <Sider
                    collapsible
                    theme="light"
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}>
                    <div className="logo">
                        <h2>logo</h2>
                    </div>

                    <Menu theme="light" defaultSelectedKeys={['/']} mode="inline" items={items} />
                </Sider>
                <Layout>
                    <Header style={{ padding: 0, background: colorBgContainer }} />
                    <Content style={{ margin: '0 16px' }}>
                        <Outlet />
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Mernspace pizza shop</Footer>
                </Layout>
            </Layout>
    </div>
  )
}

export default Dashboard
