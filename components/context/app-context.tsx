import React, { createContext, ReactNode, useCallback, useMemo, useState } from 'react';
import { JsonRpcProvider, StaticJsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import Web3Modal from 'web3modal';

import { ExtensionType, netInfo } from '../core/data/base';
let web3Accounts: any, web3Enable: any;
if (typeof window !== 'undefined') {
  const dapp = require('@polkadot/extension-dapp');
  web3Accounts = dapp.web3Accounts;
  web3Enable = dapp.web3Enable;
}

const defaultContextValue = {
  connected: false,
  wallet: "",
  extension: ExtensionType.MetaMask,
  provider: new StaticJsonRpcProvider(process.env.metaMaskRpcURI),
  updateWallet: (account: any) => {},
  connect: () => {},
  connectPolkadot: () => {},
  disconnect: () => {},
};

export const AppContext = createContext(defaultContextValue);

type Props = {
  children: ReactNode;
}

/**
 * determine if in IFrame for Ledger Live
 */
const isIframe = () => {
  return typeof window === 'undefined' ? true : window.location !== window.parent.location;
};

const providerOptions: any = {
  walletconnect: {
    options: {
      rpc: {
        1: netInfo.mainnet.rpcURI,
        4: netInfo.rinkeby.rpcURI
      }
    }
  }
};

/**
 * this is a static mainnet only RPC Provider
 * should be used when querying AppSlice from other chains
 * because we don't need tvl, apy, marketcap, supply, treasuryMarketVal for anything but mainnet
 * @returns StaticJsonRpcProvider for querying
 */
const getMainnetStaticProvider = () => {
  return new StaticJsonRpcProvider(netInfo.mainnet.rpcURI);
};

const initModal = typeof window !== 'undefined' ? new Web3Modal({
  network: netInfo.mainnet.network,
  cacheProvider: true,
  providerOptions,
}) : null;

export function AppProvider({children}: Props) {
  const [wallet, setWallet] = useState('');
  const [extension, setExtension] = useState<ExtensionType>(ExtensionType.MetaMask);
  const [connected, setConnected] = useState(false);
  const [provider, setProvider] = useState<JsonRpcProvider>(getMainnetStaticProvider);
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>(initModal as Web3Modal);
  const [chainChanged, setChainChanged] = useState(true);

  const updateWallet = (account: any) => {
    setWallet(account);
  };

  const hasCachedProvider = (): boolean => {
    if (!web3Modal) return false;
    return !!web3Modal.cachedProvider;

  };

  const onChainChangeComplete = () => {
    setChainChanged(false);
  };

  // NOTE (appleseed): none of these listeners are needed for Backend API Providers
  // ... so I changed these listeners so that they only apply to walletProviders, eliminating
  // ... polling to the backend providers for network changes
  const _initListeners = useCallback(
    (rawProvider: any) => {
      if (!rawProvider.on) {
        return;
      }
      rawProvider.on("accountsChanged", async (accounts: string[]) => {
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.reload()
          }
        }, 1);
      });

      rawProvider.on("chainChanged", async () => {
        setChainChanged(true);
        // if (typeof window !== 'undefined') {
        //   setTimeout(() => window.location.reload(), 1);
        // }
      });

      rawProvider.on("networkChanged", async () => {
        setChainChanged(true);
      });
    },
    [provider],
  );

  const connectPolkadot = useCallback(async () => {
    setExtension(ExtensionType.Polkadot);
    if (typeof window !== "undefined") {
      try {
        const allInjected = await web3Enable('Frontier');
        const allAccounts = await web3Accounts();
        if (!allInjected.length || !allAccounts.length) {
          alert('Not Found Polkadot Extension. Please install');
          return;
        } else {
          setWallet(allAccounts[0].address);
          setConnected(true);
        //   TODO: add polkadot provider setting
        }
      } catch (ex) {
        console.log('ex = ', ex);
      }
    }
  }, []);

  const connect = useCallback(async () => {
    setExtension(ExtensionType.MetaMask);
    // handling Ledger Live;
    let rawProvider;
    rawProvider = await web3Modal.connect();

    // new _initListeners implementation matches Web3Modal Docs
    // ... see here: https://github.com/Web3Modal/web3modal/blob/2ff929d0e99df5edf6bb9e88cff338ba6d8a3991/example/src/App.tsx#L185
    _initListeners(rawProvider);

    const connectedProvider = new Web3Provider(rawProvider, "any");
    setProvider(connectedProvider);


    const connectedAddress = await connectedProvider.getSigner().getAddress();
    // alert(connectedAddress)
    // Save everything after we've validated the right network.
    // Eventually we'll be fine without doing network validations.
    setWallet(connectedAddress);
    setConnected(true);
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    // const {data} = await axios.post('/check',  connectedAddress, config);
    // alert(data.message)


    // Keep this at the bottom of the method, to ensure any repaints have the data we need

    return connectedProvider;
  }, [provider, connected, web3Modal]);

  const disconnect = useCallback(async () => {
    if (extension === ExtensionType.MetaMask) {
      web3Modal.clearCachedProvider();
    } else {
      setWallet('');
    }
    setConnected(false);

    setTimeout(() => {
      if (typeof (window as any) !== 'undefined') {
        window.location.reload();
      }
    }, 1);
  }, [provider, web3Modal, connected]);

  const value = useMemo(() => ({
    connected,
    wallet,
    extension,
    provider,
    updateWallet,
    connect,
    connectPolkadot,
    disconnect
  }), [
    connected,
    wallet,
    extension,
    provider,
    updateWallet,
    connect,
    connectPolkadot,
    disconnect
  ]);

  return (<>
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  </>);

}