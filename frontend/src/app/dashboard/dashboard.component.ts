import { Component,OnInit, HostListener,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { MailService } from '../services/mail.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  
})
export class DashboardComponent implements OnInit  {
  details = false
  openedMail = false
  composeMailDashboard = false
  showSentMailsDiv = false
  showRecievedMailsDiv = true
  showDraftsMailsDiv = false
  showFavoritesMailsDiv = false
  format = false
  savedDraft = false
  replyTextBox = false;
  messageSent = false
  changeActiveStatusInbox = true
  starClicked = false
  viewReplyedMails = false
  emptyReplyArray:boolean = false
  filterText: String = ""
  toShow:Boolean = true
  showComma = false
  favMarked = false
  favNotMarked = false
  replied = false
  noUsers = false //unauthorized
  receiversNotFound = false
  allReceiversPresent = false
  draftDiscarded = false


  mobileOpenedMail = false
  mobileComposeMail = false
  mobileNavBar = false
  noReceiversMentioned = false
  newMailReceiver: string = ""
  newMailSubject: string = ""
  newMailContent: string = ""
  replyMailContent: string = ""
  id:any
  DateNow = Date.now()
  user:any
  userObj:any
  temp:any
  lottieAnim:any
  selectorForStarClasses:any
  isLoading:Boolean = false
  currentUser:any
  selfSending = false
  //Array of objects used for storing all received mails
  public receivedMails = 
  [
    {sender: {username:String, firstName:"", lastName:String, dob:String}, dateTime:this.DateNow, subject:String, content:"", receivers:[{username:String, firstName:String, lastName:String, dob:String}], favorites:"favoritesStarIcon", id:0, trheadId:Number, toShow:true}
  ]
  //Array of objects used for storing all sent mails
  public sentMails = 
  [
    {sender: {username:String, firstName:String, lastName:String, dob:String}, dateTime:this.DateNow, subject:String, content:"", receivers:[{username:String, firstName:"", lastName:String, dob:String, comma:"," }], favorites:"favoritesStarIcon", id:0, trheadId:Number, toShow:true}
  ]
  //Array of objects used for storing all drafts
  public drafts = 
  [
    {sender: {username:String, firstName:String, lastName:String, dob:String},subject:String, content:"", receivers:[{username:String, firstName:"", lastName:String, dob:String}],id:0, toShow:true}
  ]
  //Array of objects used for storing all favorites
  public favorites = 
  [
    {sender: {username:String, firstName:String, lastName:String, dob:String}, dateTime:this.DateNow, subject:String, content:"", receivers:[{username:String, firstName:"", lastName:String, dob:String, comma:"," }], favorites:"orange", id:0, trheadId:Number, toShow:true}
  ]
  //Array of objects used for selected mail's data.
  public selectedMail = {sender: {username:String, firstName:String, lastName:String, dob:String}, dateTime:this.DateNow,subject:"", content:"", receivers:[{username:"", firstName:String, lastName:String, dob:String}], favorites:"favoritesStarIcon", id:0}
  //Arr used for storing receivers while typing them and later stored in jsonObj down below
  public arr = []
  jsonObj = {receiverUsernames:this.arr, subject:this.newMailSubject, content:this.newMailContent}
  //Arr used for storing receivers while typing them and later stored in jsonObj down below
  
 
  //array of objs used for storing all replied mails
  public getAllReplyedMails = [{username:String, dateTime:this.DateNow, content:String}]
  constructor(private mail: MailService, private router: Router){}
  //array of objs used for storing all replied mails


  ngOnInit(): void{

    ///Whenever application is launched this part of code gets all received mails
    let usernamePassword = "Basic " + localStorage.getItem("auth")
    this.mail.showRecievedMails(usernamePassword).subscribe((response) =>{
      this.receivedMails = response
      //This part of code fetches received mails which are marked as favorite. This will enable 'star', which represents markAsFavorite button in this case 'icon', to stay orange if the mail with that star on it was marked as favorite beforehand. So basically star will stay orange even on refresh
      this.mail.getFavorites(usernamePassword).subscribe((response) => {
        this.favorites = response
        for(let i = 0; i < this.favorites.length;i++){
          for(let j = 0; j < this.receivedMails.length;j++){
              if(this.favorites[i].id == this.receivedMails[j].id){
                this.id = this.receivedMails[j].id
                this.temp = document.getElementById(this.id)
                this.temp.style.color = 'orange'
              }
          }
        }
      },(error:HttpErrorResponse) => {
        if(error.status == 401){
          setTimeout(() => {
            this.noUsers = !this.noUsers
          }, 100);
          setTimeout(() => {
            this.noUsers = !this.noUsers
          }, 2000);
        }
      })
      //This part of code fetches received mails which are marked as favorite. This will enable 'star', which represents 'markAsFavorite()' call button in this case 'icon', to stay orange if the mail with that star on it was marked as favorite beforehand. So basically star will stay orange even on refresh
      

    },(error:HttpErrorResponse) => {
      if(error.status == 401){
        setTimeout(() => {
          this.noUsers = !this.noUsers
        }, 100);
        setTimeout(() => {
          this.noUsers = !this.noUsers
        }, 2000);
      }
    })
    ///Whenever application is launched this part of code gets all received mails


    //Fetches all sent mails when app is launched
    this.mail.showSentMails(usernamePassword).subscribe((response) =>{
      this.sentMails = response
    },(error:HttpErrorResponse) => {
      if(error.status == 401){
        setTimeout(() => {
          this.noUsers = !this.noUsers
        }, 100);
        setTimeout(() => {
          this.noUsers = !this.noUsers
        }, 2000);
      }
    })
    //Fetches all sent mails when app is launched
    
  }

  //This function will mark an email as favorite. It receives 'mailID' of email. Every email has its own ID which was sent from data base. That ID is also CSS ID of every star(icon in HTML).Every mail is represented in seprate DIV generated with ngFor which cycles through arrays of objects called: receivedMails, sentMails, drafts, favorites 
  markAsFavorite(id:any){
    this.temp = document.getElementById(id)
    this.lottieAnim = document.getElementById("lottie"+id)
    this.temp.style.color == "orange" ? this.temp.style.color = "gray" : this.temp.style.color = "orange"
    if(this.temp.style.color == "orange") this.lottieAnim.play()
    setTimeout(() => {
      this.lottieAnim.stop()
    }, 500);
    this.temp.classList.add("favMailStarAnimation")
    setTimeout(() => {
      this.temp.classList.remove("favMailStarAnimation")
    }, 600);
    let usernamePassword = "Basic " + localStorage.getItem("auth")
    
    this.mail.markAsFavorite(usernamePassword, id).subscribe((response) => {
      if(this.temp.style.color == "orange"){
        setTimeout(() => {
          this.favMarked = !this.favMarked
        }, 100);
        setTimeout(() => {
          this.favMarked = !this.favMarked
        }, 2000);
      }

      if(this.temp.style.color == "gray"){
        setTimeout(() => {
          this.favNotMarked = !this.favNotMarked
        }, 100);
        setTimeout(() => {
          this.favNotMarked = !this.favNotMarked
        }, 2000);
      }
    },(error:HttpErrorResponse) => {
      if(error.status == 401){
        setTimeout(() => {
          this.noUsers = !this.noUsers
        }, 100);
        setTimeout(() => {
          this.noUsers = !this.noUsers
        }, 2000);
      }
      else{
        console.log("Some other error")
      }
    })
  }
  //This function will mark an email as favorite. It receives 'mailID' of email. Every email has its own ID which was sent from data base. That ID is also CSS ID of every star(icon in HTML).Every mail is represented in seprate DIV generated with ngFor which cycles through arrays of objects called: receivedMails, sentMails, drafts, favorites 

  ///This function is called whenever u unmark favorites from 'favorites' tab
    unMarkFavorite(id:any){
      this.temp = document.getElementById("fav" + id)
      
      let usernamePassword = "Basic " + localStorage.getItem("auth")
      this.temp.style.color == "gray" ? this.temp.style.color = "orange" : this.temp.style.color = "gray"
      this.temp.classList.add("unFavMailStarAnimation")
      setTimeout(() => {
        this.temp.classList.remove("unFavMailStarAnimation")
      }, 600);
      this.mail.markAsFavorite(usernamePassword, id).subscribe((response) => {
        
        this.selectedMail.id = id
        setTimeout(() => {
          this.favNotMarked = !this.favNotMarked
        }, 100);
        setTimeout(() => {
          this.favNotMarked = !this.favNotMarked
        }, 2000);
        this.mail.getFavorites(usernamePassword).subscribe((response) =>{
          this.favorites = response
        },(error:HttpErrorResponse) => {
          if(error.status == 401){
            setTimeout(() => {
              this.noUsers = !this.noUsers
            }, 100);
            setTimeout(() => {
              this.noUsers = !this.noUsers
            }, 2000);
          }
        })
      },(error:HttpErrorResponse) => {
        if(error.status == 401){
          setTimeout(() => {
            this.noUsers = !this.noUsers
          }, 100);
          setTimeout(() => {
            this.noUsers = !this.noUsers
          }, 2000);
        }
        else{
          console.log("Some other error")
        }
      })
    }
 ///This function is called whenever u unmark favorites from 'favorites' tab

  //This function is called whenever you click on 'sent' mails in navbar. Its purpose is to fetch all sentMails and show them.
  changeToSentMails(){
    this.showSentMailsDiv = true
    this.showRecievedMailsDiv = false
    this.showDraftsMailsDiv = false
    this.showFavoritesMailsDiv = false
    this.isLoading = true
    let usernamePassword = "Basic " + localStorage.getItem("auth")
    this.mail.showSentMails(usernamePassword).subscribe((response) =>{
      this.sentMails = response
      //This part of code is used for showing favorites dynamically. It will make stars orange if sent emails were marked as favorite beforehand. Even on refresh.
      this.mail.getFavorites(usernamePassword).subscribe((response) => {
        this.favorites = response
        for(let i = 0; i < this.favorites.length;i++){
          for(let j = 0; j < this.sentMails.length;j++){
              if(this.favorites[i].id == this.sentMails[j].id){
                this.id = this.sentMails[j].id
                this.temp = document.getElementById(this.id)
                this.temp.style.color = 'orange'
              }
          }
        }
      },(error:HttpErrorResponse) => {
        if(error.status == 401){
          setTimeout(() => {
            this.noUsers = !this.noUsers
          }, 100);
          setTimeout(() => {
            this.noUsers = !this.noUsers
          }, 2000);
        }
      })
      this.isLoading = false
      //This part of code is used for showing favorites dynamically. It will make stars orange if sent emails were marked as favorite beforehand. Even on refresh.
    },(error:HttpErrorResponse) => {
      if(error.status == 401){
        setTimeout(() => {
          this.noUsers = !this.noUsers
        }, 100);
        setTimeout(() => {
          this.noUsers = !this.noUsers
        }, 2000);
      }
    })
  }
  //This function is called whenever you click on 'sent' mails in navbar. Its purpose is to fetch all sentMails and show them.

  //This function is called whenever you click on 'received' mails in navbar. Its purpose is to fetch all receivedMails and show them.
  changeToRecievedMails(){
    this.showRecievedMailsDiv = true
    this.showSentMailsDiv = false
    this.showDraftsMailsDiv = false
    this.showFavoritesMailsDiv = false
    let usernamePassword = "Basic " + localStorage.getItem("auth")

    this.mail.showRecievedMails(usernamePassword).subscribe((response) =>{
      this.receivedMails = response
     //This part of code is used for showing favorites dynamically. It will make stars orange if received emails were marked as favorite beforehand. Even on refresh.
      this.mail.getFavorites(usernamePassword).subscribe((response) => {
        this.favorites = response
        for(let i = 0; i < this.favorites.length;i++){
          for(let j = 0; j < this.receivedMails.length;j++){
              if(this.favorites[i].id == this.receivedMails[j].id){
                this.id = this.receivedMails[j].id
                this.temp = document.getElementById(this.id)
                this.temp.style.color = 'orange'
              }
          }
        }
      },(error:HttpErrorResponse) => {
        if(error.status == 401){
          setTimeout(() => {
            this.noUsers = !this.noUsers
          }, 100);
          setTimeout(() => {
            this.noUsers = !this.noUsers
          }, 2000);
        }
      })
      //This part of code is used for showing favorites dynamically. It will make stars orange if sent emails were marked as favorite beforehand. Even on refresh.
      
    },(error:HttpErrorResponse) => {
      if(error.status == 401){
        setTimeout(() => {
          this.noUsers = !this.noUsers
        }, 100);
        setTimeout(() => {
          this.noUsers = !this.noUsers
        }, 2000);
      }
    })
  }
  //This function is called whenever you click on 'received' mails in navbar. It's purpose is to fetch all receivedMails and show them.

  //Change to drafts, fetch all drafts and show them
  changeToDrafts(){
    this.showRecievedMailsDiv = false
    this.showSentMailsDiv = false
    this.showDraftsMailsDiv = true
    this.showFavoritesMailsDiv = false
    let usernamePassword = "Basic " + localStorage.getItem("auth")
    this.mail.getDrafts(usernamePassword).subscribe((response) =>{
      this.drafts = response
      
    },(error:HttpErrorResponse) => {
      if(error.status == 401){
        setTimeout(() => {
          this.noUsers = !this.noUsers
        }, 100);
        setTimeout(() => {
          this.noUsers = !this.noUsers
        }, 2000);
      }
    })

  }
   //Change to drafts, fetch all drafts and show them

  //discard message/draft
  discardDraft(mailId:any, showMessage:Boolean= true){
    this.lottieAnim = document.getElementById("trashBin" + mailId)
    let usernamePassword = "Basic " + localStorage.getItem("auth")
    this.mail.discardDraft(mailId, usernamePassword).subscribe(response =>{
      this.lottieAnim.play()
      setTimeout(() => {
        this.lottieAnim.stop()
        this.mail.getDrafts(usernamePassword).subscribe((response) =>{
          this.drafts = response
          setTimeout(() => {
            if(showMessage == true) this.draftDiscarded = true
          }, 100);
          setTimeout(() => {
            this.draftDiscarded = false
          }, 2000);
        },(error:HttpErrorResponse) => {
          if(error.status == 401){
            setTimeout(() => {
              
              this.noUsers = !this.noUsers
            }, 100);
            setTimeout(() => {
              this.noUsers = !this.noUsers
            }, 2000);
          }
        })
      }, 2000);
    },(error:HttpErrorResponse)=>{
      console.log("Greska")
    })
  }
  //discard message/draft




  //Change to favorites, fetch all favorites and show them
  changeToFavorites(){
    this.showFavoritesMailsDiv = true
    this.showRecievedMailsDiv = false
    this.showSentMailsDiv = false
    this.showDraftsMailsDiv = false
    let usernamePassword = "Basic " + localStorage.getItem("auth")
    this.mail.getFavorites(usernamePassword).subscribe((response) =>{
      this.favorites = response
    },(error:HttpErrorResponse) => {
      if(error.status == 401){
        setTimeout(() => {
          this.noUsers = !this.noUsers
        }, 100);
        setTimeout(() => {
          this.noUsers = !this.noUsers
        }, 2000);
      }
    })
  }
  //Change to favorites, fetch all favorites and show them

  //Open compose text box
  openComposeMail(){
    this.composeMailDashboard = true
    this.openedMail = false
    this.newMailContent = ""
    this.newMailSubject = ""
    this.newMailReceiver = ""
    this.arr = []
    this.selectedMail.id = -1
  }
   //Open compose text box

  //Open compose text box when draft was clicked. It will push all saved data from inputs to the inputs as new values. It receives subject, content and ID of selected draft. Those arguments were fetched from object 'drafts'. Argument 'id' is used for finding cooresponding draft in array of objects called 'drafts'.
  openComposeMailDrafts(subject:any, content:any,id:any){
    this.composeMailDashboard = true
    this.openedMail = false
    this.newMailContent = content
    this.newMailSubject = subject
    this.newMailReceiver = ""
    this.selectedMail.id = id
    this.arr = []
    for(let i = 0; i < this.drafts.length;i++){
      if(id == this.drafts[i].id){
        for(let j = 0; j < this.drafts[i].receivers.length;j++){
          this.arr.push(this.drafts[i].receivers[j].username)
        }
      }
    }
  }
  //Open compose text box when draft was clicked. It will push all saved data from inputs to the inputs as new values. It receives subject, content and ID of selected draft. Those arguments were fetched from object 'drafts'. Argument 'id' is used for finding cooresponding draft in array of objects called 'drafts'.

  //This function is called whenever u click 'save as draft' button.
   saveToDraftsAndCloseCompose(){
    
    let usernamePassword = "Basic " + localStorage.getItem("auth")
    if(this.arr.length == 0 && this.newMailContent.length == 0 && this.newMailSubject.length == 0) return
    this.mail.sendDrafts(usernamePassword, this.arr, this.newMailSubject, this.newMailContent, this.selectedMail.id).subscribe(responese =>{

      setTimeout(() => {
        this.savedDraft = true
        let usernamePassword = "Basic " + localStorage.getItem("auth")
        this.mail.getDrafts(usernamePassword).subscribe((response) =>{
          this.drafts = response
        },(error:HttpErrorResponse) => {
          if(error.status == 401){
            setTimeout(() => {
              this.noUsers = !this.noUsers
            }, 100);
            setTimeout(() => {
              this.noUsers = !this.noUsers
            }, 2000);
          }
        })
      }, 100);
      setTimeout(() => {
        this.savedDraft = false
      }, 4000);
    },(error:HttpErrorResponse) => {
      if(error.status == 401){
        setTimeout(() => {
          this.noUsers = !this.noUsers
        }, 100);
        setTimeout(() => {
          this.noUsers = !this.noUsers
        }, 2000);
      }
      else if(error.status == 404){
        setTimeout(() => {
          this.receiversNotFound = !this.receiversNotFound
        }, 100);
        setTimeout(() => {
          this.receiversNotFound = !this.receiversNotFound
        }, 2000);
      }
      else{
        console.log("Some other error");
      }
    })
    this.composeMailDashboard = !this.composeMailDashboard
  }
  //This function is called whenever u click 'save as draft' button.
  
  //closes compose text box 
  closeCompose(){
    this.composeMailDashboard = !this.composeMailDashboard
  }
  //closes compose text box 

  //Open selected mail and close it f's
  //When u select mail which u wanna see its content. Its id, subject, content, receivers arr, sender name etc, will be pushed in this object. This object will help with showing that mail and its content in dashboardSelectedMail div
  selectMailToOpen(email:any){
    this.selectedMail = email
    this.openedMail = true
    this.composeMailDashboard = false
    this.viewReplyedMails = false
  }
  //When u select mail which u wanna see its content. Its id, subject, content, receivers arr, sender name etc, will be pushed in this object. This object will help with showing that mail and its content in dashboardSelectedMail div

  //Will close that mail
  closeOpenedMail(){
    this.openedMail = false
  }
  //Open selected mail and close it f's



  
  //This part of code will delete receiver from object arr, which is used for storing receivers.
  deleteFromReceivers(mailUsername:string){
    let index
    for(let i = 0; i < this.arr.length;i++){
      if(this.arr[i] == mailUsername){
        index = i
        break
      }
    }
    this.arr.splice(index,1)
  }
  //Because of gmail-like input for new mail, I had to check for every enter. When ever u finish with typing new mail it will push it to the array of objects called arr.
  //So it will store every receiver. It is field of class. Which can be used globally 
  checkForEnter(){
    if(this.newMailReceiver.search("@") > -1){
      let extractedUsername = this.newMailReceiver.split("@")
      this.currentUser = localStorage.getItem("username")
      if(extractedUsername[0] != this.currentUser){
        this.arr.push(extractedUsername[0])
        this.newMailReceiver = ""
      }else{
        setTimeout(() => {
          this.selfSending = true
        }, 100);
        setTimeout(() => {
          this.selfSending = false
        }, 4000);
      }
      
      
    }else {
      if(this.newMailReceiver.length > 0){
        setTimeout(() => {
          this.format = true
        }, 100);
        setTimeout(() => {
          this.format = false
        }, 4000);
      }
    }
  }
  //Because of gmail-like input for new mail, I had to check for every enter. When ever u finish with typing new mail it will push it to the array of objects called arr.
  //So it will store every receiver. It is field of class. Which can be used globally 

  //Method called when u click on send mail. It will send 'auth' username:password in base64 encoding format, aswell as receivers subject and content to service. Which will be stored in another object inside a method.
  sendNewEmail()
  {
    let usernamePassword = "Basic " + localStorage.getItem("auth")
    this.jsonObj =  {receiverUsernames:this.arr, subject:this.newMailSubject, content:this.newMailContent}
    if(this.arr.length > 0){
      this.currentUser = localStorage.getItem("username")
      let flag = false
      for(let i = 0; i < this.arr.length;i++){
        if(this.arr[i] == this.currentUser){
          flag = true
          break
        }
      }
      if(flag == false){
        this.mail.sendNewEmail(usernamePassword, this.jsonObj).subscribe(response => {
          this.composeMailDashboard = false
          this.newMailReceiver = ""
          this.newMailSubject = ""
          this.newMailContent = ""
          this.arr = []
          this.discardDraft(this.selectedMail.id, false)
          
          setTimeout(() => {
            this.messageSent = true
            this.mail.showSentMails(usernamePassword).subscribe((response) =>{
              this.sentMails = response
            },(error:HttpErrorResponse) => {
              if(error.status == 401){
                setTimeout(() => {
                  this.noUsers = !this.noUsers
                }, 100);
                setTimeout(() => {
                  this.noUsers = !this.noUsers
                }, 2000);
              }
            })
          }, 100);
          setTimeout(() => {
            this.messageSent = false
          }, 4000);
        },(error:HttpErrorResponse) => {
          if(error.status == 401){
            setTimeout(() => {
              this.noUsers = !this.noUsers
            }, 100);
            setTimeout(() => {
              this.noUsers = !this.noUsers
            }, 2000);
          }
          else if(error.status == 404){
            setTimeout(() => {
              this.receiversNotFound = !this.receiversNotFound
            }, 100);
            setTimeout(() => {
              this.receiversNotFound = !this.receiversNotFound
            }, 2000);
          }
          else{
            console.log("Some other error");
          }
        });
      }else {
        setTimeout(() => {
          this.selfSending = !this.selfSending
        }, 100);
        setTimeout(() => {
          this.selfSending = !this.selfSending
        }, 2000);
      }
      
    }else{
      setTimeout(() => {
        this.noReceiversMentioned = !this.noReceiversMentioned
      }, 100);
      setTimeout(() => {
        this.noReceiversMentioned = !this.noReceiversMentioned
      }, 2000);
    }
    
  }
   //Method called when u click on send new mail. It will send 'auth' username:password in base64 encoding format, aswell as receivers subject and content. Which will be stored in another object inside a method.
  
  ///Get all replied mails if there are any
  getReplyedMails(){
    let usernamePassword = "Basic " + localStorage.getItem("auth")
    this.mail.getReplyedMails(usernamePassword, this.selectedMail.id).subscribe(response => {
      this.getAllReplyedMails = response
      this.viewReplyedMails = !this.viewReplyedMails
      this.replyTextBox = false
      if(this.getAllReplyedMails.length == 0){
        this.emptyReplyArray = true;
      }else this.emptyReplyArray = false
    }, (error:HttpErrorResponse) => {
      if(error.status == 401) {
        setTimeout(() => {
          this.noUsers = !this.noUsers
        }, 100);
        setTimeout(() => {
          this.noUsers = !this.noUsers
        }, 2000);
      }
    })
  }
///Get all replied mails if there are any

  ///Reply
  sendReply(){
    let usernamePassword = "Basic " + localStorage.getItem("auth")
    this.mail.sendReply(usernamePassword, this.selectedMail.id, this.replyMailContent).subscribe(response => {
      this.replyTextBox = false
      this.replyMailContent = ""
      setTimeout(() => {
        this.replied = !this.replied
      }, 100);
      setTimeout(() => {
        this.replied = !this.replied
      }, 2000);
    }, (error:HttpErrorResponse) => {
      if(error.status == 404){
        setTimeout(() => {
          this.receiversNotFound = !this.receiversNotFound
        }, 100);
        setTimeout(() => {
          this.receiversNotFound = !this.receiversNotFound
        }, 2000);
      }
      if(error.status == 401){
        setTimeout(() => {
          this.noUsers = !this.noUsers
        }, 100);
        setTimeout(() => {
          this.noUsers = !this.noUsers
        }, 2000);
      }
    })
  }
   ///Reply

  //Open reply and close reply text box
  openReplyTextBox(){
      this.replyTextBox = true
      this.viewReplyedMails = false
  }
  closeReplyTextBox(){
    this.replyTextBox = false
  }
 //Open reply and close reply text box

  ////Log out
  logOut(){
    //deleting auth and user fro mlocal storage
    localStorage.removeItem("auth")
    localStorage.removeItem("user")
    //redirecting to login register form
    this.router.navigate(["/Login-Register"])
  }
  ///Log out

  //Filter mails
  filter(){
    let myInput = this.filterText.toLocaleLowerCase()
    console.log(this.favorites)
    if(this.filterText != ""){
      this.toShow = true
      for(let i = 0; i < this.receivedMails.length; i ++){
          let $this = this.receivedMails[i].sender.firstName.toLowerCase()
          let $this2 = this.receivedMails[i].content.toLowerCase()
          if($this.indexOf(myInput) > -1 || $this2.indexOf(myInput) > -1){
            this.receivedMails[i].toShow = true
            break
          }else{
            this.receivedMails[i].toShow = false
          }
      }
      for(let n = 0; n < this.sentMails.length;n++){
        for(let j = 0; j < this.sentMails[n].receivers.length;j++){
          let $this1 = this.sentMails[n].receivers[j].firstName.toLowerCase()
          let $this3 = this.sentMails[n].content.toLowerCase()
          if($this1.indexOf(myInput) > -1 || $this3.indexOf(myInput) > -1){
            this.sentMails[n].toShow = true
            break
          }else{
            this.sentMails[n].toShow = false
            
          }
        }
      }
      for(let n = 0; n < this.drafts.length;n++){
        for(let j = 0; j < this.drafts[n].receivers.length;j++){
          let $this4 = this.drafts[n].receivers[j].firstName.toLowerCase()
          let $this5 = this.drafts[n].content.toLowerCase()
          if($this4.indexOf(myInput) > -1 || $this5.indexOf(myInput) > -1){
            this.drafts[n].toShow = true
            break
          }else{
            this.drafts[n].toShow = false
          }
        }
      }
      for(let n = 0; n < this.favorites.length;n++){
        for(let j = 0; j < this.favorites[n].receivers.length;j++){
          let $this4 = this.favorites[n].receivers[j].firstName.toLowerCase()
          let $this5 = this.favorites[n].content.toLowerCase()
          if($this4.indexOf(myInput) > -1 || $this5.indexOf(myInput) > -1){
            this.favorites[n].toShow = true
            break
          }else{
            this.favorites[n].toShow = false
          }
        }
      }
    }else{
      this.toShow = false
    }
  }
  ///Filter mails

  ///Show details of sender/receivers
  showDetails(){
    this.details = !this.details
  }

  showCommaFunction(receiver:any):Boolean{
    return this.selectedMail.receivers.indexOf(receiver) < this.selectedMail.receivers.length - 1
  }
  //both functions below and above are used for not showing comma after last receiver while showing it on front
  showCommaFunctionSecond(email:any,receiver:any):Boolean{
   return email.receivers.indexOf(receiver) < email.receivers.length - 1
  }
  ///Show details of sender/receivers
  sameUsername(username:any):Boolean{
    this.user = localStorage.getItem("user")
    this.userObj = JSON.parse(this.user)
    return this.userObj.username == username
  } 
  
}
