import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { log } from 'console';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { texts } from 'src/environments/texts';
declare var $: any;

@Component({
  selector: 'app-quad-art',
  templateUrl: './quad-art.component.html',
  styleUrls: ['./quad-art.component.scss']
})
export class QuadArtComponent implements OnInit, OnDestroy {
  status: string = 'connect';
  modalStatus: string = '';
  imageType: string = '';
  wallet: string = '';
  network: '';
  contractAv: any = null;
  nfts: any[] = [];
  nft_collect_title: string = texts.tokens_loading_start;
  numbers: any;
  date: any;
  public captchaResponse = "";
  readonly environment = environment;
  readonly texts = texts;
  public isAuthenticating = false;

  public nftsGrid = [];

  subscription: Subscription[] = [];

  selectedNft: any;
  isChangeNft: boolean;
  
  @HostListener('window:load')
  onLoad() {
    $('body').addClass('loaded quadart');
  }
  constructor(private authService: AuthService) {
    this.onLoad();
   }

  ngOnInit(): void {
    this.initNFTsGrid();
    this.subscription.push(this.authService.subject$.subscribe((data) => {
      this.wallet = data.account;
      this.network = data.network;
      this.contractAv = data.contractAv;
      if(this.wallet){
        this.getOwnership(this.wallet);
      }
      this.getStatus();
    }));
    let date = new Date().getTime();
    this.date = date;
  }

  // create an array of 225 elements, with the help of which we display the grid in view
  initNFTsGrid() {
    this.nftsGrid = new Array(225).fill(225)
    .map((obj, i) => ({
      id: i,
      disabled: true,
      text: i+1,
      url: undefined
    }));
  }

  setMetadataToCorrectGrid() {
    let date = new Date().getTime();
    this.nfts.find((nft, index)=> {
      this.nftsGrid[nft.Id].disabled = false;
      this.nftsGrid[nft.Id].url = nft.Image || '../../../assets/imgnew/quadarto/photo.png';
    });
  }

  updateGridMetadata(data) {
    // console.log(data);
    let date = new Date().getTime();
    this.date = date;
    this.nfts.find((nft, index)=> {
      // console.log('find id',nft.Id, data.token_id);
      
      if(nft.Id == data.token_id){
        // console.log('grid index',this.nftsGrid[index], index);
        // console.log(this.date);
          
        this.nftsGrid[data.token_id].url = `${environment.api_url}img/${data?.token_id+1}.png?${date}`;
      }
    });
  }

  switchNetworks() {
    this.authService.switchNetworks();
  }

  goToOpenSea() {
      window.location.href = environment.openseaUrl;
  }

  connect() {
    this.authService.initWeb3().then(() => {
      if (this.network !== environment.network) {
        this.status = 'network';
        return;
      }
    }).then(()=> {
      // this.getOwnership(this.wallet);
    });
  }

  disconnect() {
    this.authService.logout();
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
          environment.contractAvQuadArto.toString().toLowerCase()
        ) {
          let tok = await this.contractAv.methods.tokenURI(nft.token_id).call();
          let data = (await this.decodeURL(tok)) as any;
          
          //Decode URL
          let nftObj = {
            Id: nft.token_id,
            Name: data?.name,
            Image: data?.image,
            showPreloader: false,
          };

          this.nfts.push(nftObj);
        }
      }

      this.nft_collect_title = texts.tokens_loading_stop_quadart.replace(
        '%length%',
        this.nfts.length.toString()
      );

      console.log('nfts', this.nfts);

      await this.setMetadataToCorrectGrid();
      
    } catch (err) {
      console.log(err);
    }
  }

  async decodeURL(url: any) {
    try {
      let response = await fetch(url, {
        headers: new Headers({
          'Access-Control-Allow-Origin': '*',
        }),
        mode: 'no-cors'
      });
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
        'https://deep-index.moralis.io/api/v2/' + token_address + '/nft' + environment.chain;

      if (cursor) {
        url += '?cursor=' + cursor;
      }

      let response = await fetch(url, {
        headers: new Headers({
          'x-api-key': environment.moralis_api_key,
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

  popup(grid: any) {
    this.modalStatus = '';
    this.selectedNft = grid;
    this.isChangeNft = false;
  }

  getStatus() {
    this.status = '';
    if (this.wallet === '') {
      this.status = 'connect';
    } else if (this.wallet) {
      this.status = 'connected';
    }
  }

  checkStatus(data){
    this.modalStatus = data.status;
    this.imageType = data.typeImage.slice(6);
    this.updateGridMetadata(data);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach(sub => sub.unsubscribe());
    }
  }
}
