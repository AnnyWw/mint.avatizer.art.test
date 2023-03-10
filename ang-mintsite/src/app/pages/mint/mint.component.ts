import { Component, HostListener, OnInit, Self } from '@angular/core';
import Web3Modal from 'web3modal';
import Web3 from 'web3';
import { ApiService } from 'src/app/services/api.service';
const abi = require('../../../assets/config/abi.json');
import WalletConnectProvider from '@walletconnect/web3-provider';
import { environment } from 'src/environments/environment';
import { texts } from 'src/environments/texts';
import { consoleLog } from '../../utils';
declare var $: any;
@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.scss'],
})
export class MintComponent implements OnInit {
  phase: string = '';
  wlMerk: any[] = [];
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
  contractAv: any = null;
  FullYear: number = new Date().getFullYear();
  isShow: boolean = false;
  isShowSuccess: boolean = false;
  readonly environment = environment;
  readonly texts = texts;
  isOpenSea: boolean;
  isDisconnect: boolean;

  @HostListener('window:load')
  onLoad() {
    $('body').addClass('loaded');
  }

  constructor(private api: ApiService) {
    this.onLoad();
    this.getStatus();
  }

  ngOnInit(): void {
    this.isOpenSea = environment.minting_status === 'not_start' ? false : true;
    this.isDisconnect = false;
    this.playVideo();
    $(document).ready(function () {
      // MANAGE JS
      $('.manage-checkbox').click(function () {
        if ($(self).is(':checked')) {
          $(self)
            .parents('.modal-body--content')
            .removeClass('paused')
            .addClass('active');
          $('.generic-status').text('Active');
          $('.generic-status').removeClass('paused').addClass('active');
        } else {
          $(self)
            .parents('.modal-body--content')
            .removeClass('active')
            .addClass('paused');
          $('.generic-status').text('Paused');
          $('.generic-status').removeClass('active').addClass('paused');
        }
      });
     // this.updateStatusButtons();
    });

    /* add Web3modal */
    $('#connect').click(function () {
      consoleLog('here');
    });
  }

  startParallax() {
    $(document).ready(function () {
      $('.img-parallax').each(function () {
        var img = $(this);
        var imgParent = $(this).parent();
        function parallaxImg() {
          var speed = img.data('speed');
          var imgY = imgParent.offset().top;
          var winY = $(window).scrollTop();
          var winH = $(window).height();
          var parentH = imgParent.innerHeight();

          // The next pixel to show on screen
          var winBottom = winY + winH;

          // If block is shown on screen
          if (winBottom > imgY && winY < imgY + parentH) {
            // Number of pixels shown after block appear
            var imgBottom = (winBottom - imgY) * speed;
            // Max number of pixels until block disappear
            var imgTop = winH + parentH;
            // Porcentage between start showing until disappearing
            var imgPercent = (imgBottom / imgTop) * 100 + (50 - speed * 50);
          }
          img.css({
            top: imgPercent + '%',
            transform: 'translateY(-' + imgPercent + '%)',
          });
        }
        $(document).on({
          scroll: function () {
            parallaxImg();
          },
          ready: function () {
            parallaxImg();
          },
        });
      });
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
      //network: environment.network, //'main', // optional
      cacheProvider: true, // optional
      providerOptions, // required
    });

    try {
      this.pendingConnect = true;
      this.getStatus();
      this.provider = await this.web3Modal.connect();
      this.web3 = new Web3(this.provider);
      this.network = await this.web3.eth.net.getNetworkType();

      //Display warning if on the wrong network
      //if(this.network !== 'main'){
      //toast("Please switch to the Ethereum Mainnet network.");
      // return;
      //}

      if (this.network !== environment.network) {
        this.status = 'network';
        this.isShow = true;
        return;
      }

      let accounts = await this.web3.eth.getAccounts();
      this.wallet = accounts[0];
      this.pendingConnect = false;

      //get phase
      this.contractAv = new this.web3.eth.Contract(
        abi,
        environment.contractAv //'0x5d74387c391b88c35425d0ec9f82750562fc173f'
      );

      let hasStarted = await this.contractAv.methods.saleStarted().call();

      if (hasStarted) {
        this.phase = 'WL';
      } else {
        this.phase = 'not started'; //right
        // this.phase = 'WL';
      }

      let hasTok = await this.contractAv.methods.balanceOf(this.wallet).call();

      consoleLog('hasTok', hasTok);

       if (hasTok > 0) {
         this.minted = true;
       } else {
         this.minted = false;
       }


      //if wl get merk
      await this.WLCheck(this.wallet);
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
    consoleLog('wallet', wallet);
    this.api.getWL(wallet).subscribe((val: any) => {
      consoleLog(val);
      this.wlMerk = val['Proof'] as any[];
      this.getStatus();
    });
  }

  async startMint() {
    if (this.status === 'not started') {
      return;
    }

    try {
      let price = 1;
      this.pending = true;
      this.getStatus();
      this.contractAv.methods
        .mint(price, this.wlMerk)
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
          this.token = reciept.events.Transfer.returnValues.tokenId;
          this.getStatus();
          consoleLog('token', this.token);
        })
        .on('error', async (error: any) => {
          //toast(error.message);
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
        this.wlMerk.length > 0 &&
        this.wallet &&
        !this.pending &&
        !this.minted
      ) {
        this.status = 'WL';
      } else {
        this.status = 'WLNot';
      }
    } else if (this.phase === 'not started') {
      if (
        this.wlMerk.length > 0 &&
        this.wallet &&
        !this.pending &&
        !this.minted
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
    this.startParallax();
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
