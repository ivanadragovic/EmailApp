import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MailService {
  
  constructor(private http:HttpClient) { }

  showRecievedMails(username:string):Observable<any>{
    const httpHeader = new HttpHeaders({
      Authorization:username
    })
    return this.http.get<any>(environment.apiUrl + "/mailService/received", {headers: httpHeader})
  }

  showSentMails(username:string):Observable<any>{
    const httpHeader = new HttpHeaders({
      Authorization:username
    })
    return this.http.get<any>(environment.apiUrl + "/mailService/sent", {headers: httpHeader})
  }

  sendNewEmail(username:string, jsonObject:any):Observable<any>{
    const httpHeader = new HttpHeaders({
      Authorization:username
    })
    
    return this.http.post<any>(environment.apiUrl + "/mailService/sendMail",
      jsonObject
    ,{headers: httpHeader})
  }

  sendReply(username:string, id:number, content:string):Observable<any>{
    const httpHeaders = new HttpHeaders({
      Authorization:username
    })
    return this.http.post<any>(environment.apiUrl + "/mailService/sendMailThread",{
      mailId: id,
      content: content
    }, {headers: httpHeaders})
  }

  getReplyedMails(username:string, mailId:any):Observable<any>{
    const httpHeaders = new HttpHeaders({
      Authorization:username
    })
    return this.http.get<any>(environment.apiUrl + ("/mailService/mailThreads/" + mailId),{headers:httpHeaders})
  }

  sendDrafts(username:string, receivers:any,subject:string, content:string,id:any):Observable<any>{
    const httpHeaders = new HttpHeaders({
      Authorization:username
    })
    return this.http.post<any>(environment.apiUrl + ("/mailService/saveDraft") ,{
      subject:subject,
      content:content,
      receiverUsernames:receivers,
      id:id
    }
    ,{headers:httpHeaders} )
  }

  getDrafts(username:string){
    const httpHeaders = new HttpHeaders({
      Authorization:username
    })
    return this.http.get<any>(environment.apiUrl + ("/mailService/drafts"), {headers:httpHeaders})
  }

  discardDraft(mailId:any, username:string):Observable<any>{
    const httpHeaders = new HttpHeaders({
      Authorization:username
    })
    return this.http.delete<any>(environment.apiUrl + ("/mailService/discardDraft/" + mailId), {headers:httpHeaders})
  }

  getFavorites(username:string):Observable<any>{
    const httpHeaders = new HttpHeaders({
      Authorization:username
    })
    return this.http.get<any>(environment.apiUrl + ("/mailService/favorites"), {headers:httpHeaders})
  }

  markAsFavorite(username:string, mailId:any):Observable<any>{
    const httpHeaders = new HttpHeaders({
      Authorization:username
    })
    return this.http.post<any>(environment.apiUrl + ("/mailService/markAsFavorite"),{
      mailId: mailId
    }, {headers:httpHeaders})
  }
}
