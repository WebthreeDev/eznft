/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable @typescript-eslint/no-unused-vars */
import './App.scss';
import './AppOverride.scss';
import './antd-override/ant-override.scss';
import Root from './core/routes/root-routing';
import { Badge, Button, Popover } from 'antd';
import { CCollapse, CContainer, CNavbar, CNavbarBrand, CNavbarNav, CNavItem, CNavLink } from '@coreui/react';

import { FaMedium, FaTelegram, FaTwitter } from 'react-icons/fa';

import { HashRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import Modal from 'antd/lib/modal/Modal';
import SubmissionHeader from './modules/components/submission-header/submission-header';
import SubmissionContent from './modules/components/submisson-content/submission-content';
import { ApplicationContext } from './core/routes/providers/application.provider';
import SearchAdressInput from './modules/components/search-address/search-address';
import moment from 'moment';
import TickerComponent from './modules/components/ticker/ticker';

import mobileLogo from './assets/core/mobile-logo.svg'
import { HomeProvider } from './core/routes/providers/home.provider';

function App() {
  const [navbarOpen, setNavbarOpen] = useState<boolean>();
  const [windowScroller, setWindowScroller] = useState<boolean>();
  const [isMobile, setIsMobile] = useState<boolean>();

  const { ctxDisabled, ctxModal } = useContext(ApplicationContext) as any;

  const [visibleModal, setVisibleModal] = ctxModal;
  const [buttonDisabled, setButtonDisabled] = ctxDisabled;

  let navbarRef: HTMLDivElement | null;
  const BREAKPOINTS = { mobile: 0, tablet: 768, desktop: 1280 }

  const initBreakpointOberver = () => {
    let bkps = window.matchMedia('(max-width: 991px)');
    setIsMobile(bkps.matches);
    bkps.onchange = (e: any) => {
      setIsMobile(bkps.matches);
    };

  }
  useEffect(() => {
    if (window.scrollY > 0) {
      setWindowScroller(true);
    }
    document.addEventListener('scroll', (e) => {
      if (window.scrollY > 0) {
        setWindowScroller(true);
      } else {
        setWindowScroller(false);

      }
    })
    initBreakpointOberver();

  }
    , [])


  const toggleNavbar = () => {
    if (isMobile) {
      setNavbarOpen(!navbarOpen)
    }
  }

  const [sendSubmit, setSendSubmit] = useState<boolean>();
  const submit = () => {
    setSendSubmit(true)
    setTimeout(() => {
      setSendSubmit(false)
    }, 300)

  }

  return (
    <HashRouter>
      <HomeProvider>
        <div className="App">
          <CNavbar className={`${windowScroller ? 'sticky' : ''}`} ref={e => navbarRef = e} expand="lg" colorScheme="light" >
            <CContainer fluid>

              <CNavbarBrand style={{ width: '100%' }}>
                <a style={{ display: 'flex', width: 'fit-content' }} href="/#/">
                  <img alt="Logo" src="https://raw.githubusercontent.com/WebthreeDev/eznft/main/Untitled%20Design%20(13).png" className="brand-logo h-lg-40px" />
                  <img className="brand-logo mobile" src={mobileLogo} alt="" />
                </a>
                <div className="togglers">
                  <Button type="text" id="toggler" className='hamburger-toggle d-lg-none btn btn-icon btn-active-color-primary w-30px h-30px ms-n2 me-3' icon={
                    <span className="svg-icon svg-icon-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M21 7H3C2.4 7 2 6.6 2 6V4C2 3.4 2.4 3 3 3H21C21.6 3 22 3.4 22 4V6C22 6.6 21.6 7 21 7Z" fill="black"></path>
                        <path opacity="0.3" d="M21 14H3C2.4 14 2 13.6 2 13V11C2 10.4 2.4 10 3 10H21C21.6 10 22 10.4 22 11V13C22 13.6 21.6 14 21 14ZM22 20V18C22 17.4 21.6 17 21 17H3C2.4 17 2 17.4 2 18V20C2 20.6 2.4 21 3 21H21C21.6 21 22 20.6 22 20Z" fill="black"></path>
                      </svg>
                    </span>
                  }
                    onClick={toggleNavbar}
                  />
                  <div className="getaudited" style={{ display: 'flex', columnGap: '10px', alignItems: 'center' }}>
                    <CNavItem key="2000" style={{ listStyle: 'none' }}>
                      <Link
                        to="/request-audit">
                        <CNavLink className="menu-item menu-lg-down-accordion me-lg-1 menu-link py-3 menu-title" target="_blank" active>
                          Get Audit + KYC
                        </CNavLink>
                      </Link>
                    </CNavItem>
                    <Button
                      onClick={() => setVisibleModal(true)}
                      className="submitButton" type="primary"
                      size='large' style={{ color: '#152B36 !important', fontSize: '14px', fontWeight: '500' }}
                    >Submit</Button>
                  </div>

                </div>
                <div className="input">
                  <SearchAdressInput ></SearchAdressInput>

              </div>
            </CNavbarBrand>
            <CCollapse className="navbar-collapse" visible={navbarOpen}>
              <CNavbarNav>
                <Popover content={'get up to 20% rewards on your next $SPY purchase'} >
                  <Badge count="NEW" offset={[-15, 7]} style={{ fontSize: '10px', lineHeight: "19px", height: '18px', minHeight: '18px' }} status='success'>
                    <CNavItem key="1">
                      <Link
                        onClick={toggleNavbar}
                        to="/charity">
                        <CNavLink style={{ fontSize: '13px' }} className="menu-item menu-lg-down-accordion me-lg-1 menu-link py-3 menu-title" active>
                          Got Scammed?
                        </CNavLink>
                      </Link>
                    </CNavItem>
                  </Badge>
                </Popover>
                <CNavItem key="2">
                  <Badge count="NEW" offset={[-15, 1]} style={{ fontSize: '10px', lineHeight: "19px", height: '18px', minHeight: '18px' }} status='success'>
                    {/*<Link*/}
                    {/*  onClick={toggleNavbar}*/}
                    {/*  to="/request-audit">*/}
                      {/*<CNavLink className="menu-item menu-lg-down-accordion me-lg-1 menu-link py-3 menu-title" target="_blank" active>*/}
                      {/*  Get Audit + KYC*/}
                      {/*</CNavLink>*/}
                      <CNavLink target='__blank' href="https://t.me/Joe_ChainGuard">
                        Get Audit + KYC
                      </CNavLink>
                    {/*</Link>*/}
                  </Badge>
                </CNavItem>
                <CNavItem key="3">
                  <CNavLink target='__blank' href="https://uniswap.org">
                    Buy $SPY
                  </CNavLink>
                </CNavItem>
                <CNavItem key="4"
                >
                  <Link
                    onClick={toggleNavbar}
                    to="/frequently-asked-questions">
                    <CNavLink>
                      FAQ
                    </CNavLink>
                  </Link>
                </CNavItem>
                <div className="inline-icons" style={{ display: 'flex' }}>
                  <CNavItem key="5" className="social">
                    <CNavLink href="https://twitter.com/ChainGuard" target='__blank'>
                      <FaTwitter color={'#a1a5b7'} fontSize={20} />
                    </CNavLink>
                  </CNavItem>
                  <CNavItem key="6" className="social">
                    <CNavLink href="https://t.me/ChainGuard" target='__blank'>
                      <FaTelegram color={'#a1a5b7'} fontSize={20} />
                    </CNavLink>
                  </CNavItem>
                  <CNavItem key="7" className="social">
                    <CNavLink href="https://ChainGuard.medium.com/" target='__blank'>
                      <FaMedium color={'#a1a5b7'} fontSize={20} />
                    </CNavLink>
                  </CNavItem>
                </div>

                <Button onClick={() => setVisibleModal(true)} className="submitButton submit-desktop" type="primary" size='large' style={{ color: '#152B36 !important', fontSize: '14px', fontWeight: '500' }} >Submit</Button>
              </CNavbarNav>
            </CCollapse>
          </CContainer>
        </CNavbar>
        <TickerComponent></TickerComponent>
        <div className="breadcumb-navigation" style={{ width: '100%', maxWidth: '1264px', padding: '10px' }}>

        </div>

        <Root />
        <div className="footer py-4 d-flex flex-lg-column" id="kt_footer">
          <div className="container-xxl d-flex flex-column flex-md-row align-items-center justify-content-between">
            <div className="text-dark order-2 order-md-1">
              <span className="text-muted fw-bold me-1">© {moment().year()}</span>
              <a href="https://ChainGuard.co" target="_blank" className="text-gray-800 text-hover-primary">ChainGuard</a>
            </div>
            <ul className="menu menu-gray-600 menu-hover-primary fw-bold order-1">

              <li className="menu-item">
                <Link to="disclaimer">
                  <a className="menu-link px-2">Disclaimer</a>
                </Link>
              </li>
              <li className="menu-item">
                <a href="mailto:audit@ChainGuard.co" target="_blank" className="menu-link px-2">Contact Us</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      </HomeProvider>

      <Modal
        title={
          <SubmissionHeader></SubmissionHeader>
        }
        visible={visibleModal}
        width={'100%'}
        centered={true}
        style={{ width: '100%', maxWidth: '650px', margin: 0 }}
        okText="Submit"
        onOk={
          submit
        }
        destroyOnClose={true}
        onCancel={
          () => setVisibleModal(false)
        }
        closable={true}
        okButtonProps={{
          disabled: buttonDisabled
        }}
      >
        <SubmissionContent submitProp={sendSubmit}></SubmissionContent>
      </Modal>


    </HashRouter>
  );
}

export default App;
