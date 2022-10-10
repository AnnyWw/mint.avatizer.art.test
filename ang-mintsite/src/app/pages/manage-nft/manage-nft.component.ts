import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  isShow: boolean = false;
  readonly environment = environment;
  readonly texts = texts;
  FullYear: number = new Date().getFullYear();

  constructor() {}

  ngOnInit(): void {
    $(document).ready(function () {
      // NEW HEADER JS
      $('.menu-tab').click(function () {
        $('.main-menu').toggleClass('show');
        $('.menu-tab').toggleClass('active');
      });

      $(document).mouseup(function (e: any) {
        var container = $('.main-menu');
        var container2 = $('.logo-header');
        if (
          container.has(e.target).length === 0 &&
          container2.has(e.target).length === 0
        ) {
          container.removeClass('show');
          $('.menu-tab').removeClass('active');
        }
      });

      // FOOTER JS
      $('#up').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 500);
        return false;
      });

      var FSHeight = $('#first_screen_wrap').innerHeight();
      $(window).on('scroll', function () {
        const position = $(self).scrollTop();
        if (position >= FSHeight) {
          $('#up').css('opacity', '1');
        } else {
          $('#up').css('opacity', '0');
        }
      });

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

      // INDEX JS
      $('.img-parallax').each(function () {
        var img = $(self);
        var imgParent = $(self).parent();
        function parallaxImg() {
          var speed = img.data('speed');
          var imgY = imgParent.offset().top;
          var winY = $(self).scrollTop();
          var winH = $(self).height();
          var parentH = imgParent.innerHeight();

          // The next pixel to show on screen
          var winBottom = winY + winH;

          // If block is shown on screen
          var imgPercent;
          if (winBottom > imgY && winY < imgY + parentH) {
            // Number of pixels shown after block appear
            var imgBottom = (winBottom - imgY) * speed;
            // Max number of pixels until block disappear
            var imgTop = winH + parentH;
            // Porcentage between start showing until disappearing
            imgPercent = (imgBottom / imgTop) * 100 + (50 - speed * 50);
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

      $('.scrollTo').bind('click', function () {
        if ($.scrollTo !== undefined) {
          if ($(self).attr('href').indexOf('#') == 0) {
            $.scrollTo($(self).attr('href'), 600);
            return false;
          }

          return false;
        }

        return false;
      });

      if ($.colorbox !== undefined) {
        $('.colorbox, .screenshot').colorbox({ opacity: 0.6, speed: 200 });

        $('.overlay').colorbox({
          iframe: true,
          title: '',
          notshowbtns: true,
          scrolling: false,
          opacity: 0.6,
          speed: 200,
          innerHeight: function () {
            return $.urlParam('height', $(self).attr('href'));
          },
          innerWidth: function () {
            return $.urlParam('width', $(self).attr('href'));
          },
          /*            href: function () {
                        return $.urlParam('href', $(self).attr('href'));
                    },*/
          onOpen: function () {
            // activeScroll = true;
          },
          onClosed: function () {
            // activeScroll = false;
          },
        });
      } //end colorbox

      (function ($) {
        $('.hPound').bind('click', function (e: any) {
          var anchor = $(self);
          var dst = $(anchor.attr('href'));
          if (dst.offset() !== undefined) {
            $('html, body').stop().animate(
              {
                scrollTop: dst.offset().top,
              },
              1000
            );
          }

          var wh = $(window).width();
          if (wh <= 768) {
            if (dst.offset() !== undefined) {
              $('html, body')
                .stop()
                .animate(
                  {
                    scrollTop: dst.offset().top - 50,
                  },
                  1000
                );
            }
          }
          e.preventDefault();
        });
        return false;
      })($);

      //function showing a youtube video in iframe
      (function ($) {
        $('.if-video').each(function () {
          var parent = $(self).parent('div');
          var myVideo = $(self);

          if (parent.length > 0) {
            var play = parent.find('.play:not(.mobile)');
            if (play.length == 0 || play === undefined || play == 'undefined') {
              play = parent.find('.play-new:not(.mobile)');
            }

            if (play.length > 0) {
              play.bind('click', function () {
                $(self).parent('.controls').addClass('hidden').hide();
                myVideo.attr('src', myVideo.attr('data-src'));
                myVideo.fadeIn(1500);
              });
            }
          }
        });

        var play = $('.play:not(.mobile, .overlay)');
        if (play.length == 0 || play === undefined || play == 'undefined') {
          play = $('.play-new:not(.mobile, .overlay)');
        }

        $('#videoModal').on('show.bs.modal', function (e: any) {
          setTimeout(function () {
            play.click();
          }, 200);
        });
        play.on('click', function (event: any) {
          var playself = event.target.closest('a');
          var play_src = $(playself).attr('data-src');
          var controls = $(playself).parent();
          var embedHgPr = controls.parent().height();
          var embedHg = controls.nextAll('img').height();
          var iframeEl = $('<iframe></iframe>').attr({
            class: 'embed-responsive-item',
            src: play_src,
            id: 'video',
            allow: 'autoplay; fullscreen',
          });
          controls.addClass('embed-responsive embed-responsive-16by9').css({
            width: '100%',
            'padding-bottom': embedHgPr,
            height: embedHg,
            position: 'relative',
          });
          controls.nextAll('img').remove();
          controls.html(iframeEl);
          iframeEl[0].contentWindow.postMessage(
            '{"event":"command","func":"playVideo","args":""}',
            '*'
          );
          return false;
        });
      })($);

      /* replace retina src images if use class image2x */
      var image2x = function () {
        //console.log('images2x');
        var pixelRatio = !!window.devicePixelRatio
          ? window.devicePixelRatio
          : 1;

        //var pixelRatio = 2; //hidden for retina

        // verify the existence of the file
        var use_if_file_exists = false;

        if (pixelRatio > 1) {
          if (use_if_file_exists) {
            var http = new XMLHttpRequest();
          }
          __handleBgImageTo2xBg(use_if_file_exists);

          var els = $('img.image2x').get();

          var len = els.length;

          for (var i = 0; i < len; i++) {
            var src = els[i].src;
            var data_src = $(els[i]).data('src');
            var data_srcset = $(els[i]).data('srcset');
            var srcset = $(els[i]).attr('srcset');
            var source = $(els[i]).siblings('source').get();

            if (data_src == undefined) {
              data_src = '';
            }
            if (data_srcset == undefined) {
              data_srcset = '';
            }
            if (srcset == undefined) {
              srcset = '';
            }

            src = __replaceImgTo2Img(src);
            data_src = __replaceImgTo2Img(data_src);
            data_srcset = __replaceImgTo2Img(data_srcset);
            srcset = __replaceImgTo2Img(srcset);
            reolaceSrcset(source);
            if (use_if_file_exists) {
              if (UrlExists(src)) {
                $(els[i]).attr({
                  src: src,
                  'data-src': data_src,
                  'data-srcset': data_srcset,
                  srcset: srcset,
                });
              }
            } else {
              $(els[i]).attr({
                src: src,
                'data-src': data_src,
                'data-srcset': data_srcset,
                srcset: srcset,
              });
            }
          }
        }

        function __handleBgImageTo2xBg(useIfFileExists: any) {
          $('.image2x[data-background-image]').each(function (i: any, el: any) {
            var jQueryEl = $(el);
            var data_background_image = $(els[i]).data('background-image');

            if (useIfFileExists) {
              // Example: jQueryEl.css('backgroundImage') = url("/images/upload/bkg-cover/bgHeadLand@2x.jpg")
              if (
                UrlExists(
                  __replaceImgTo2Img(
                    data_background_image.substring(
                      5,
                      data_background_image.length - 2
                    )
                  )
                )
              ) {
                __replaceBgImageTo2xBg(jQueryEl);
              }
            } else {
              __replaceBgImageTo2xBg(jQueryEl);
            }
            return true;
          });
        }

        function __replaceBgImageTo2xBg(jQueryEl: any) {
          jQueryEl.attr(
            'data-background-image',
            __replaceImgTo2Img(jQueryEl.data('background-image'))
          );
        }

        function __replaceImgTo2Img(currentString: any) {
          if (currentString.match('@2x')) {
            return currentString;
          } else {
            return currentString
              .replace('.png', '@2x.png')
              .replace('.jpg', '@2x.jpg')
              .replace('.webp', '@2x.webp');
          }
        }

        function reolaceSrcset(els: any) {
          var len = els.length;
          for (var i = 0; i < len; i++) {
            var src = els[i].srcset;
            els[i].srcset = __replaceImgTo2Img(src);
          }
        }

        function UrlExists(url: any) {
          http.open('HEAD', url, false);
          http.send();
          return http.status != 404;
        }
      };

      /*--------------------------------*/
      /* START init lazyload */
      var lozad: any;
      var initLazyload;
      if (typeof lozad == 'function') {
        if (initLazyload == undefined) {
          initLazyload = function () {
            lozad('.lazyload', {
              loaded: function (el: any) {
                el.classList.remove('lazyload');
              },
            }).observe();

            image2x();

            $(window).load(function () {
              $(document).trigger('scroll', {
                detail: 'Display on trigger...',
              });
            });
          };
        }

        initLazyload();
      } else {
        image2x();
      }
      /* STOP init lazyload */
    });

    document.addEventListener('DOMContentLoaded', function (event) {
      $('body').addClass('loaded');
    });

    /* add Web3modal */
    $('#connect').click(function () {
      //console.log('here');
    });

    //this.initWeb3();
    this.getStatus();
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
      //console.log(this.network);

      //Display warning if on the wrong network
      if (this.network !== 'goerli') {
        //toast("Please switch to the Ethereum Mainnet network.");
        this.status = 'network';
        this.isShow = true;
        return;
      }

      let accounts = await this.web3.eth.getAccounts();
      //console.log(accounts);
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
    //console.log(token);
    this.select = token;
    this.gene = token.Generative;
    //this.myModal.nativeElement.click()
    this.openModel();
    //$('#collect-modal-1').modal('show');
  }

  openModel() {
    this.myModal.nativeElement.className = ' modal show modal-backdrop';
  }
  closeModel() {
    this.select = '';
    this.myModal.nativeElement.className = 'modal hide';
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
          };

          this.nfts.push(nftObj);
          /*let isClaimed = await this.contractAv.methods.gen1_token_to_jiraverse_pass(nft.token_id).call();
          if(isClaimed === 0){
            gen.push(nft.token_id);
          }*/
        }
      }

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
        //console.log(data);
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
        //console.log(data);
      }
      return data;
    } catch (err) {
      //console.log(err)
    }
  }

  async toggleGen() {
    //console.log(this.gene);
    try {
      if (this.gene) {
        let change = await this.contractAv.methods
          .unpauseDNAGeneration(this.select.Id)
          .send({ from: this.wallet });
        this.select.Generative = true;
      } else {
        let change = await this.contractAv.methods
          .pauseDNAGeneration(this.select.Id)
          .send({ from: this.wallet });
        this.select.Generative = false;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async stopGen() {}

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
  }

  closeNotify() {
    this.isShow = !this.isShow;
  }
}
