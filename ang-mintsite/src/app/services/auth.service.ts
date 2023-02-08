import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';
import Web3 from 'web3';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const abi = require('../../assets/config/abi.json');

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  web3Modal: any = null;
  provider: any = null;
  contractAv: any = null;
  web3: any = null;
  public subject$ = new BehaviorSubject<any>({network: '', account: '', contractAv: null});
  constructor(private http: HttpClient) {}

  async initWeb3() {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: environment.walletconnect_infuraId, // '68bbfa6dd6594f328012419c5b654b2f', // required
        },
      },
    };
    this.web3Modal = new Web3Modal({
      //network:  environment.network,
      cacheProvider: true,
      providerOptions,
    });

    try {
      this.provider = await this.web3Modal.connect();
      this.web3 = new Web3(this.provider);
      const network = await this.web3.eth.net.getNetworkType();
      const accounts = await this.web3.eth.getAccounts();
          //get phase
      this.contractAv = new this.web3.eth.Contract(
      abi,
      environment.contractAvQuadArto //'0x5d74387c391b88c35425d0ec9f82750562fc173f'
    );
      this.subject$.next({network: network, account: accounts[0], contractAv: this.contractAv});
    } catch (err: any) {
      console.log(err);
    }
  }

  async switchNetworks() {
    try {
      await this.web3.currentProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: Web3.utils.toHex('5') }], // goerli 5
      });
      this.initWeb3();
    } catch (err) {
      console.log(err);
    }
  }

  logout() {
    try {
      this.web3Modal.clearCachedProvider();
      this.subject$.next({network: '', account: '', contractAv: null});
      location.reload();

      return {};
    } catch (err) {
      return null;
    }
  }
}
