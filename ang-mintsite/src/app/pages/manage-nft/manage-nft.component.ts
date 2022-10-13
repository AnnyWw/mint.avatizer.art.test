import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import Web3Modal from 'web3modal';
import Web3 from 'web3';
import { environment } from 'src/environments/environment';
import { texts } from 'src/environments/texts';
const abi = require('../../../assets/config/abi.json');
declare var $: any;

@Component({
  selector: 'app-manage-nft',
  templateUrl: './manage-nft.component.html',
  styleUrls: ['./manage-nft.component.scss'],
})
export class ManageNFTComponent implements OnInit {
  @ViewChild('collectmodal1') myModal: ElementRef;
  contract: string = '';
  web3Modal: any = null;
  web3: any = null;
  provider: any = null;
  wallet: string = '';
  pending: boolean = false;
  pendingConnect: boolean = false;
  network: string = '';
  status: string = '';
  contractAv: any = null;
  nfts: any[] = [];
  modal: boolean = true;
  select: any = null;
  gene: boolean = false;
  //showPreloader: boolean = false;
  isShow: boolean = false;
  readonly environment = environment;
  readonly texts = texts;
  FullYear: number = new Date().getFullYear();
    nft_collect_title: string = texts.tokens_loading;

  @HostListener('window:load')
  onLoad() {
    $('body').addClass('loaded');
  }

  constructor() {
    this.onLoad();
  }

  ngOnInit(): void {
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
    });

    /* add Web3modal */
    // $('#connect').click(function () {
    //   console.log('here');
    // });

    //this.initWeb3();
    this.getStatus();
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

  async initWeb3() {
    //console.log('here');
    /*const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: environment.walletconnect_infuraId, //"68bbfa6dd6594f328012419c5b654b2f" // required
        }
      }
    };*/

    this.web3Modal = new Web3Modal({
      network: 'goerli', // optional
      cacheProvider: true, // optional
      //providerOptions // required
    });

    try {
      this.pendingConnect = true;
      this.getStatus();
      this.provider = await this.web3Modal.connect();
      this.web3 = new Web3(this.provider);
      this.network = await this.web3.eth.net.getNetworkType();

      //Display warning if on the wrong network
      if (this.network !== 'goerli') {
        //toast("Please switch to the Ethereum Mainnet network.");
        this.status = 'network';
        this.isShow = true;
        return;
      }

      let accounts = await this.web3.eth.getAccounts();
      this.wallet = accounts[0];

      this.contractAv = new this.web3.eth.Contract(
        abi,
        environment.contractAv //'0x5D74387c391b88C35425d0Ec9f82750562fc173F'
      );

      this.getOwnership(this.wallet);
      this.pendingConnect = false;
      this.getStatus();
    } catch (err: any) {
      console.log(err);
    }
  }

  popup(token: any) {
    this.select = token;
    this.gene = token.Generative;
    this.openModel();
  }

  openModel() {
    this.myModal.nativeElement.className = ' modal show fade in';
    this.myModal.nativeElement.parentElement.offsetParent.className =
      'loaded modal-open';
  }
  closeModel() {
    //this.select = '';
    this.myModal.nativeElement.className = 'modal fade';
    this.myModal.nativeElement.parentElement.offsetParent.className = 'loaded';
  }

  async switchNetworks() {
    try {
      await this.web3.currentProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: Web3.utils.toHex('5') }],
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

  async getOwnership(wallet: string) {
    try {
      let ethNFTs = [] as any;
      let data = (await this.getMoralisData(wallet, null)) as any;
      ethNFTs = ethNFTs.concat(data.result);
      let count1 = 0;

      while (data.cursor) {
        data = (await this.getMoralisData(wallet, data.cursor)) as any;
        ethNFTs = ethNFTs.concat(data.result);
        count1++;
      }

      this.nfts = [];

      for (let nft of ethNFTs) {
        //Gen1
        if (
          nft.token_address.toString().toLowerCase() ===
          environment.contractAv.toString().toLowerCase()
          //'0x5D74387c391b88C35425d0Ec9f82750562fc173F'.toString().toLowerCase()
        ) {
          let tok = await this.contractAv.methods.tokenURI(nft.token_id).call();
          let data = (await this.decodeURL(tok)) as any;
          let isClaimed = await this.contractAv.methods
            .pausedTokenGenes(nft.token_id)
            .call();

          //Decode URL
          let nftObj = {
            Id: nft.token_id,
            Name: data?.name,
            Image: data?.image,
            Generative: isClaimed === '0x0' || !isClaimed ? true : false,
            showPreloader: false,
          };

          this.nfts.push(nftObj);
          /*let isClaimed = await this.contractAv.methods.gen1_token_to_jiraverse_pass(nft.token_id).call();
          if(isClaimed === 0){
            gen.push(nft.token_id);
          }*/
        }
      }
        this.nft_collect_title = texts.tokens_length.replace( '%length%', this.nfts.length.toString()); 
      console.log('nfts', this.nfts);

      //Show Elgibility
    } catch (err) {
      console.log(err);
      //toast(err.message)
    }
  }

  async decodeURL(url: any) {
    try {
      let response = await fetch(url);
      let data = null;

      if (response) {
        data = await response.json();
      }

      return data;
    } catch (err) {}
  }

  async getMoralisData(token_address: string, cursor: any) {
    try {
      let url =
        'https://deep-index.moralis.io/api/v2/' +
        token_address +
        '/nft?chain=goerli';

      if (cursor) {
        url += '?cursor=' + cursor;
      }

      let response = await fetch(url, {
        headers: new Headers({
          'x-api-key':
            'komhjNL5MNJS8cGgsLeBSTtQcQDSRShS9cAWwPIyLzno7t9vzdgH7rTqsUE8gJ8x',
        }),
      });

      let data = null;

      if (response) {
        data = await response.json();
      }

      return data;
    } catch (err) {
      console.log(err);
    }
  }

  async toggleGen() {
    try {
      this.select.showPreloader = true;

      if (this.gene) {
        await this.contractAv.methods
          .unpauseDNAGeneration(this.select.Id)
          .send({ from: this.wallet });

        this.select.Generative = true;
      } else {
        await this.contractAv.methods
          .pauseDNAGeneration(this.select.Id)
          .send({ from: this.wallet });

        this.select.Generative = false;
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.select.showPreloader = false;
    }
  }

  getStatus() {
    this.status = '';

    if (this.wallet === '') {
      this.status = 'connect';
    } else if (this.network !== 'goerli') {
      this.status = 'network';
    } else if (this.pendingConnect) {
      this.status = 'pendingConnect';
    } else if (this.pending) {
      this.status = 'pending';
    }

    this.status;
    this.startParallax();
  }

  closeNotify() {
    this.isShow = !this.isShow;
  }
}
