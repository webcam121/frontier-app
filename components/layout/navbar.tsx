import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import Router from 'next/router';

import { AppContext } from '../context/app-context';
import Icon from '../ui-kit/icon';

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const {connected, wallet, connect, connectPolkadot, disconnect} = useContext(AppContext);
  const extensionRef = useRef<HTMLDivElement>(null);

  const onConnect = useCallback(async () => {
    connect();
    setShowConnectModal(false);
    Router.push('/token');
  }, []);

  const onConnectPolkadot = useCallback(async () => {
    connectPolkadot();
    setShowConnectModal(false);
    Router.push('/token');
  }, []);

  const connectWallet = useCallback(async () => {
    if (!connected) {
      setShowConnectModal(true);
    } else {
      onDisconnect();
    }
  }, [connected]);

  const onDisconnect = useCallback(() => {
    disconnect();
  }, []);

  const shortenTxHash = useCallback((txHash: any) => {
    return txHash.substr(0, 6) + '...' + txHash.substr(txHash.length - 4);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (extensionRef.current && !extensionRef.current.contains(event.target)) {
        setShowConnectModal(false);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
  };

  return (
    <nav className="h-80 bg-secondary z-10 flex px-15 sticky text-white filter drop-shadow-lg">
      <div className="container px-0 mx-auto flex justify-between xl:justify-start">
        <Link href="/"><a className="flex items-center"><Image src="/assets/images/logo.svg" height={38} width={130}
                                                                    alt="Skatin logo"/></a></Link>
        <button className="xl:hidden px-10" onClick={() => setNavbarOpen(!navbarOpen)}><Icon name="menu" color="white"
                                                                                             size={27}/></button>
        <div className={
          "fixed xl:relative duration-300 transition-all xl:transition-none h-screen xl:h-auto xl:flex flex-col xl:flex-row xl:flex-grow w-full md:w-365 bg-secondary xl:bg-opacity-0 top-0 ml-0 xl:ml-50 px-20 xl:px-0 justify-start xl:justify-between items-start xl:items-center drop-shadow-lg" +
          (navbarOpen ? " left-0 ease-out-in" : " -left-800 xl:left-0 ease-in-out")
        }>
          <div className="flex w-full xl:hidden justify-between py-30">
            <Link href="/"><a className="flex xl:hidden items-center"><Image src="/assets/images/logo.svg" height={44}
                                                                                  width={152} alt="Frontier logo"/></a></Link>
            <button className="px-10" onClick={() => setNavbarOpen(false)}><Icon name="close" color="white" size={25}/>
            </button>
          </div>
          <ul className="flex flex-col xl:flex-row font-medium text-16 xl:text-14 pl-30 xl:pl-0">
            <li className="py-15 nav-link"><Link href="/shop-plans"><a
              className="relative xl:px-25 xl:py-10">Shop Plans</a></Link></li>
            <li className="py-15 nav-link"><Link href="/business"><a
              className="relative xl:px-25 xl:py-10">Business</a></Link></li>
            <li className="py-15 nav-link"><Link href="/current-customers"><a
              className="relative xl:px-25 xl:py-10">Current Customers</a></Link></li>
            <li className="py-15 nav-link"><Link href="/blog"><a className="relative xl:px-25 xl:py-10">Blog</a></Link>
            </li>
            {navbarOpen && <li className="py-15 nav-link cursor-pointer"><a
                className="relative xl:px-25 xl:py-10" onClick={connectWallet}>{connected ? shortenTxHash(wallet) : 'Connect'}</a></li>}
          </ul>
          <div className="hidden xl:block flex items-center px-5">
              <button onClick={connectWallet} className="btn-warning btn-mini mr-10">{connected ? shortenTxHash(wallet) : 'Connect'}</button>
          </div>
        </div>
      </div>

      <div ref={extensionRef}
        className={'absolute flex justify-center top-0 left-0 bottom-0 right-0 bg-light-60 z-50 ' + (showConnectModal ? 'block' : 'hidden')}>
        <div
             className="flex flex-col sm:flex-row h-400 sm:h-200 mt-200 bg-secondary-100 rounded-xl p-40 border border cursor-pointer"
             >
          <div className="flex flex-col items-center h-200 w-200 hover:opacity-50" onClick={() => onConnect()}>
            <img src="/assets/images/metamask.svg" width={75} alt="MetaMask Logo"/>
            <span className="text-white text-25 font-medium">Metamask</span>
            <span className="text-warning text-12">Connect your metamask wallet</span>
          </div>
          <div className="flex flex-col items-center h-200 w-200 hover:opacity-50" onClick={() => onConnectPolkadot()}>
            <img src="/assets/images/polkadot.svg" width={75} alt="Polkadot Logo"/>
            <span className="text-white text-25 font-medium">Polkadot</span>
            <span className="text-warning text-12">Connect your polkadot wallet</span>
          </div>
        </div>
      </div>
    </nav>
  );
}