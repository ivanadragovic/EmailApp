import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string):Observable<any>
  {
    return this.http.post<any>(environment.apiUrl + "/authentication/login", {
      username: email,
      password: password
    });
  }

  register(email: string, password: string, firstName: string, lastName: string, dob: Date)
  {
    return this.http.post<any>(environment.apiUrl + "/authentication/register", {
      username: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      dob: dob
    });
  }
  changePassword(email:string,changedPassword:string)
  {
    return this.http.post<any>(environment.apiUrl + "/authentication/changePassword",{
      username: email,
      newPassword: changedPassword
    })
  }
}
