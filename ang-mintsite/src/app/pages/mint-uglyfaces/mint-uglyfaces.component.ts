import { Component, HostListener, OnInit, Self } from '@angular/core';
import Web3Modal from 'web3modal';
import Web3 from 'web3';
import { ApiService } from 'src/app/services/api.service';
const abi = require('../../../assets/config/abi.json');
const whitelist = require('../../../environments/whitelist.json');
import WalletConnectProvider from '@walletconnect/web3-provider';
import { environment } from 'src/environments/environment';
import { texts } from 'src/environments/texts';
import { consoleLog } from '../../utils';
declare var $: any;

@Component({
  selector: 'app-mint-uglyfaces',
  templateUrl: './mint-uglyfaces.component.html',
  styleUrls: ['./mint-uglyfaces.component.scss']
})
export class MintUglyfacesComponent implements OnInit {
  phase: string = '';
  wlMerk: boolean = false;
  proof: any[] = [];
  mintState: string = '';
  contract: string = '';
  web3Modal: any = null;
  web3: any = null;
  provider: any = null;
  wallet: string = '';
  pending: boolean = false;
  pendingConnect: boolean = false;
  minted: boolean = false;
  network: string = '';
  token: number = 0;
  status: string = '';
  contractAvUgfs: any = null;
  FullYear: number = new Date().getFullYear();
  isShow: boolean = false;
  isShowSuccess: boolean = false;
  readonly environment = environment;
  readonly texts = texts;
  isOpenSea: boolean;
  isDisconnect: boolean;
  availableNFT: number = 0;
  amountNFT: number = 1;
  inStockNFT: number;

  @HostListener('window:load')
  onLoad() {
    $('body').addClass('loaded');
  }

  constructor(private api: ApiService) {
    this.onLoad();
    this.getStatus();
  }

  ngOnInit(): void {
    
    this.isOpenSea = environment.minting_status === 'not_started' ? false : true;
    this.isDisconnect = false;
    this.playVideo();
    
    /* add Web3modal */
    $('#connect').click(function () {
      consoleLog('here');
    });
  }

  async playVideo() {
    let videoElem = document.getElementById('video');
    try {
      await videoElem[0].play();
    } catch (err) {
      // console.log(err);
    }
  }

  async initWeb3() {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: environment.walletconnect_infuraId, // '68bbfa6dd6594f328012419c5b654b2f', // required
        },
      },
    };

    this.web3Modal = new Web3Modal({
      network: environment.network, //'main', // optional
      cacheProvider: true, // optional
      providerOptions, // required
    });

    try {
      this.pendingConnect = true;
      this.getStatus();
      this.provider = await this.web3Modal.connect();
      this.web3 = new Web3(this.provider);
      this.network = await this.web3.eth.net.getNetworkType();

      let accounts = await this.web3.eth.getAccounts();
      this.wallet = accounts[0];
      

      if (this.network !== environment.network) {
        this.status = 'network';
        return;
      }

      //get phase
      this.contractAvUgfs = new this.web3.eth.Contract(
        abi,
        environment.contractAvUgfs //'0x5d74387c391b88c35425d0ec9f82750562fc173f'
      );

      // let hasStarted = await this.contractAvUgfs.methods.saleStarted().call();
      let hasStarted = environment.minting_status_ugfs;
      // consoleLog(hasStarted)
      if (hasStarted === 'phase_whitelist') {
        this.phase = 'WL';
      } else {
        this.phase = 'not started'; //right
        // this.phase = 'WL';
      }

      //if wl get merk
      await this.WLCheck(this.wallet);
      this.pendingConnect = true;
      this.inStockNFT = await this.contractAvUgfs.methods.numberMinted(this.wallet).call();
      console.log('inStockNFT' ,this.inStockNFT);
      
      //  if (this.inStockNFT > 0) {
      //    this.minted = true;
      //  } else {
      //    this.minted = false;
      //  }
       this.getStatus();
    } catch (err: any) {
      console.log(err);
      
    }
  }

  async switchNetworks() {
    try {
      await this.web3.currentProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: Web3.utils.toHex('1') }],
      });
      this.initWeb3();
    } catch (err) {
      console.log(err);
      this.isShow = true;
    }
  }

  logout() {
    try {
      this.web3Modal.clearCachedProvider();
      location.reload();

      return {};
    } catch (err) {
      return null;
    }
  }

  WLCheck(wallet: string) {
    consoleLog('WLCheck wallet', wallet);
    this.api.getWL(wallet).subscribe((val: any) => {
      consoleLog('get wl::', val);
      this.proof = val['Proof'] as any[];
      console.log('this proof', this.proof);
      this.pendingConnect = false;
      this.getStatus();
    });

    if (whitelist[wallet] !== undefined) {
      console.log(whitelist[wallet]);
      this.availableNFT = whitelist[wallet];
    } else {
      console.log('availableNFT', this.availableNFT);
      this.availableNFT = 1;
    }
   
  }

  setAmountNft(amount: number) {
    this.amountNFT = amount;
    console.log(this.amountNFT);
    
  }

  async startMint() {
    if (this.status === 'not started') {
      return;
    }

    try {
      let amount = this.amountNFT;
      this.pending = true;
      this.getStatus();
      
      this.contractAvUgfs.methods
        .mint(amount, this.availableNFT, this.proof)
        .send({ from: this.wallet })
        .on('transactionHash', async (hash: any) => {
          this.pending = true;
          this.getStatus();
          //toast("Transaction has been started. Please wait for the transaction to be confirmed.");
        })
        .on('receipt', async (reciept: any) => {
          //toast("Transaction has completed.");
          this.pending = false;
          this.minted = true;
          this.isShowSuccess = true;
          this.token = reciept.events?.Transfer?.returnValues?.tokenId;
          this.inStockNFT = await this.contractAvUgfs.methods.numberMinted(this.wallet).call();
          this.getStatus();
          consoleLog('token', this.token);
        })
        .on('error', async (error: any) => {
          //toast(error.message);
          this.isShow = true;
          this.pending = false;
          this.getStatus();
        });
    } catch (err) {
      console.log(err);
      this.pending = false;
      this.getStatus();
    }
  }

  getStatus() {
    this.status = '';

    if (this.wallet === '') {
      this.status = 'connect';
    } else if (this.network !== environment.network) {
      this.status = 'network';
    } else if (this.pendingConnect) {
      this.status = 'pendingConnect';
    } else if (this.pending) {
      this.status = 'pending';
    } else if (this.minted) {
      this.status = 'minted';
    } else if (this.phase === 'WL') {
      if (
        this.proof.length > 0 &&
        this.wallet
      ) {
        this.status = 'WL';
      } else {
        this.status = 'WLNot';
      }
    } else if (this.phase === 'not started') {
      if (
        this.proof.length > 0 &&
        this.wallet
      ) {
        this.status = 'not started'; //right
        //   this.status = 'WL';
      } else {
        this.status = 'WLNot'; //right
        //this.status = 'not started';
        //   this.status = 'WL';
      }
    }
    consoleLog('phase:', this.phase);
    consoleLog('wallet:', this.wallet);
    consoleLog('network:', this.network);
    consoleLog('pendingConnect:', this.pendingConnect);
    consoleLog('pending:', this.pending);
    consoleLog('minted:', this.minted);
    consoleLog('status:', this.status);

    //this.status;
    this.updateIsDisconnect();
    this.updateStatusButtons();
  }

  closeNotify() {
    this.isShow = !this.isShow;
  }

  closeSuccessNotify() {
    this.isShowSuccess = !this.isShowSuccess;
  }

  updateStatusButtons() {
    $('.btn-opensea').show();
    /*if (this.status === 'WL' || this.status === 'minted' ) {
      $('.btn-opensea').show();
    } else {
      $('.btn-opensea').hide();
    }*/
  }
  updateIsDisconnect() {
    this.isDisconnect = this.status === 'connect' ? false : true;
  }
}
