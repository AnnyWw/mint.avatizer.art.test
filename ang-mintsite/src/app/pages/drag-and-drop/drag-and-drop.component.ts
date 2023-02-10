import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { log } from 'console';
import { OnExecuteData, OnExecuteErrorData, ReCaptchaV3Service } from 'ng-recaptcha';
import { Subscription, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent implements OnInit, OnDestroy {
  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
  @Input() token_id = ''; 
  @Output() statusChanged: EventEmitter<any> = new EventEmitter<any>();

  file: any;
  public recentToken = "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public recentError?: { error: any };
  public readonly executionLog: Array<OnExecuteData | OnExecuteErrorData> = [];
  fileIcon: any;
  statusFile: string = '';
  isShowCancel: boolean = true;

  private allExecutionsSubscription: Subscription;
  private allExecutionErrorsSubscription: Subscription;
  private singleExecutionSubscription: Subscription;

  constructor(private recaptchaV3Service: ReCaptchaV3Service, private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.fileIcon = (<HTMLElement>this.el.nativeElement).querySelector('.file-icon');
    this.allExecutionsSubscription = this.recaptchaV3Service.onExecute.subscribe((data) =>
      this.executionLog.push(data),
    );
    this.allExecutionErrorsSubscription = this.recaptchaV3Service.onExecuteError.subscribe((data) =>
      this.executionLog.push(data),
    );
  }

  changeStatus() {
    this.statusChanged.emit({
      status: this.statusFile,
      typeImage: this.file.type,
      token_id: this.token_id
    })
  }

  public executeAction(action: string): void {
    if (this.singleExecutionSubscription) {
      this.singleExecutionSubscription.unsubscribe();
    }
    this.singleExecutionSubscription = this.recaptchaV3Service.execute(action).subscribe(
      (token) => {
        this.recentToken = token;
        this.recentError = undefined;
        this.uploadFile(this.file, token);
      },
      (error) => {
        this.recentToken = "";
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.recentError = { error };
      },
    );
  }

  /**
     * on file drop handler
     */
  onFileDropped($event) {
    this.prepareFile($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFile(files);
  }

  isCorrectSize(size) {
    const maxSize = 5000000; //500000 bite (5MB)
    return size <= maxSize;
  }

  isCorrectType(type) {
    const ext = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];
    return ext.includes(type);
  }

  prepareFile(file) {
    if (!this.isCorrectSize(file.size) || !this.isCorrectType(file.type)) {
      this.statusFile = 'error';
      return;
    } else {
      this.statusFile = 'loaded';
      setTimeout(() => {
        if(this.isShowCancel){
          this.executeAction('upload');
        } else {
          this.isShowCancel = true;
        }
      }, 2000)
    }
    this.file = file;
  }

  cancelUpload() {
    this.statusFile = '';
    this.isShowCancel = false;
  }

  async uploadFile(file: File, token) {
    this.statusFile = 'loaded';
    const form_data = new FormData();
    form_data.append('image', file);
    form_data.append('token', token);
    form_data.append('number', this.token_id+1);

    await fetch(environment.api_url, {
      method: "POST",
      body: form_data,
    })
      .then((response) => {
        console.log('Response:::', response);
        this.statusFile = 'success';
        this.changeStatus();
        return response;
      })
      .catch((error) => {
        this.statusFile = 'error';
        console.error('Error:::', error);
      })
      .finally(()=> {
        this.changeStatus();
      });
  }

  public ngOnDestroy(): void {
    if (this.allExecutionsSubscription) {
      this.allExecutionsSubscription.unsubscribe();
    }
    if (this.allExecutionErrorsSubscription) {
      this.allExecutionErrorsSubscription.unsubscribe();
    }
    if (this.singleExecutionSubscription) {
      this.singleExecutionSubscription.unsubscribe();
    }
  }
}
