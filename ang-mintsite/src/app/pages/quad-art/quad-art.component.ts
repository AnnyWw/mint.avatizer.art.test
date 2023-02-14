import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { log } from 'console';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { texts } from 'src/environments/texts';
declare var $: any;
import { OnExecuteData, OnExecuteErrorData, ReCaptchaV3Service } from 'ng-recaptcha';

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
  
  singleExecutionSubscription: any;
  @HostListener('window:load')
  onLoad() {
    $('body').addClass('loaded quadart');
  }
  constructor(private authService: AuthService, private recaptchaV3Service: ReCaptchaV3Service) {
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

  public executeAction(action: string): void {
    this.singleExecutionSubscription = this.recaptchaV3Service.execute(action).subscribe(
      (token) => {
        this.actionSave(token);
      },
      (error) => {},
    );
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
    this.nfts.find( (nft, index)=> {
        this.nftsGrid[nft.Id-1].disabled = environment.isReveal ? true : false;
        this.nftsGrid[nft.Id-1].url = `${environment.api_url}img/${nft.Id}.png?${date}`; //`${nft.Image}?${date}`;
    });
  }

  updateGridMetadata(data) {
    let date = new Date().getTime();
    this.date = date;
    this.nfts.find((nft, index)=> {
      if(nft.Id-1 == data.token_id){
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
          if(nft.token_id != '0' && Number(nft.token_id) < 226){
            let nftObj = {
              Id: nft.token_id,
              Name: data?.name,
              Image: data?.image,
              showPreloader: false,
            };
            this.nfts.push(nftObj);
          }
          
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
        'https://deep-index.moralis.io/api/v2/' + token_address + '/nft' + environment.chain;

      if (cursor) {
        url += '&cursor=' + cursor;
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

  async actionSave(token) {
    const form_data = new FormData();
    form_data.append('act', 'save');
    form_data.append('token', token);
    form_data.append('number', this.selectedNft.id+1);
    
    await fetch(environment.api_url, {
      method: "POST",
      body: form_data,
    })
      .then((response) => {
          let date = new Date().getTime();
          this.nfts.find((nft, index)=> {
            if(nft.Id-1 == this.selectedNft.id){
              this.nftsGrid[this.selectedNft.id].url = `${environment.api_url}img/${this.selectedNft.id+1}.png?${date}`; // TODO: change to default image
            }
          });
        return response;
      })
      .catch((error) => {
        console.error('Error:::', error);
      })
      .finally(()=> {
        let date = new Date().getTime();
        this.date = date;
      });
  }

  // remove file NOW don`t used
  async removeFile(token) {
    const form_data = new FormData();
    form_data.append('image-name', this.selectedNft.id+1+'.png');
    form_data.append('token', token);
    form_data.append('number', this.selectedNft.id+1);
    
    await fetch(environment.api_url, {
      method: "POST",
      body: form_data,
    })
      .then((response) => {
          this.nfts.find((nft, index)=> {
            if(nft.Id-1 == this.selectedNft.id){
              this.nftsGrid[this.selectedNft.id].url = '../../../assets/imgnew/quadarto/photo.png'; // TODO: change to default image
            }
          });
        return response;
      })
      .catch((error) => {
        console.error('Error:::', error);
      })
      .finally(()=> {
        let date = new Date().getTime();
        this.date = date;
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach(sub => sub.unsubscribe());
    }
  }
}
