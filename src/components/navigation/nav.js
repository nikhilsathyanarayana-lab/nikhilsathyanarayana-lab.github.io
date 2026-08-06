import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';

import './nav.scss';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

// Navigation bar
// Only of note is onNavClick is to update the page title as people click on it. That's all

const Navigation = ({ onNavClick }) => (
  <div className="nav-bar">
    <div className="logo">
      <img
        src={`${window.location.origin}/images/democrm-logo.png`}
        alt="demoCRM"
        id="democrm-logo"
      />
    </div>
    <Menu
      theme="light"
      id="main-menu"
      defaultSelectedKeys={[window.location.pathname]}
    >
      <Menu.Item key="/">
        <Link to="/" onClick={() => onNavClick('Dashboard')}>
          <Icon type="home" />
          <span className="nav-text">Dashboard</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="/accounts">
        <Link to="/accounts" onClick={() => onNavClick('Accounts')}>
          <Icon className="nav-icon" type="team" />
          <span className="nav-text">Accounts</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="/contacts">
        <Link to="/contacts" onClick={() => onNavClick('Contacts')}>
          <Icon className="nav-icon" type="contacts" />
          <span className="nav-text">Contacts</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="/opportunities">
        <Link to="/opportunities" onClick={() => onNavClick('Opportunities')}>
          <Icon className="nav-icon" type="folder-open" />
          <span className="nav-text">Opportunities</span>
        </Link>
      </Menu.Item>
      <Menu.Item
        key="/mobile"
        style={{
          bottom: '10px',
          position: 'absolute',
        }}
      >
        <Link to="/mobile" onClick={() => onNavClick('Mobile')}>
          <Icon type="mobile" />
          <span className="nav-text">Mobile Demo</span>
        </Link>
      </Menu.Item>
    </Menu>
  </div>
);

export default Navigation;

Navigation.propTypes = {
  onNavClick: PropTypes.func,
};
