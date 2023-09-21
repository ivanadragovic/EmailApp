import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit {
  LoginForm = true;
  RegisterForm = false;
  FlipForRegister = true;
  FlipForLogin = false;
  NewPassword = false;
  UserExist = false;
  succesRegistration = false
  badCredentials = false
  noUserFound = false
  noSamePassword = false
  wrongFormat = false;
  userNameToSend = ""
  weakPassword = false
  data:any
  oldPasswordChanged = false
  //dodata logika za prikupljanje stvari iz local storage nakon refresha
    //pomocni objekat za prikupljanje inf sa local storage
  dataTemp = {
    username:"",
    firstName:"",
    lastName:"",
    dob:""
  }
  //'Objekat' koji kupi informaciju sa lokal storage, u njega se smesta key 'user' u koliko je prazan tj nema 'user' key u local se ubacuje 
  //prazan string primer iznad. U koliko nije prazan(imamo ulogovanog korisnika) 'objekat' 'data' koji se koristio za respons od beka, on dobija vrednosti
  //JASON-a sa locala(JASON.parse(dataUsers))
  dataUsers:any
  ////
  constructor(private auth: AuthService, private router: Router) {
   
  }

  emailLogin: string = "";
  passwordLogin: string = "";
  passwordChange:string = "";
  emailPasswordChange:string = "";

  firstNameRegister: string = "";
  lastNameRegister: string = "";
  dobRegister: Date = new Date();
  emailRegister: string = "";
  passwordRegister: string = "";

 
  ngOnInit(): void {
   
    this.dataUsers = localStorage.getItem("user")
    if(this.dataUsers != null){
      this.data = JSON.parse(this.dataUsers)
    }else{
      localStorage.setItem("user",JSON.stringify(this.dataTemp))
    }
  }
  //Changing form to 'change password'
  ChangeToNewPassword(){
    this.LoginForm = false;
    this.RegisterForm = false;
    this.NewPassword = true;
  }
//change form to log in form
  ChangeFormToLogin(){
    this.NewPassword = false;
    this.RegisterForm = false;
    this.LoginForm = true;
  }
  //change to register form
  ChangeForm(){
    this.LoginForm = !this.LoginForm
    this.RegisterForm = !this.RegisterForm
    
    if(this.FlipForRegister == true){
      this.FlipForRegister = false
    }
    if(this.FlipForRegister == false){
      this.FlipForRegister = true
    }

    if(this.FlipForLogin == true){
      this.FlipForLogin = false
    }
    if(this.FlipForLogin == false){
      this.FlipForLogin = true
    }
    
  }
  //CHANGE PASSWORD REQUEST
  changePassword(){
    let usernameToSend = this.emailPasswordChange.split("@")
    if(this.passwordChange.length >= 6){
      this.auth.changePassword(usernameToSend[0], this.passwordChange).subscribe((response) => {
        console.log("Success")
        setTimeout(() => {
          this.oldPasswordChanged = true
          this.LoginForm = true
          this.NewPassword = false
        }, 100);
        setTimeout(() => {
          this.oldPasswordChanged = false
        }, 4000);
      },(error: HttpErrorResponse) => {
        if(error.status == 404){
          
          setTimeout(() => {
            this.noUserFound = true
          }, 100);
          setTimeout(() => {
            this.noUserFound = false
          }, 2000);
        }else if(error.status == 409){
          
          setTimeout(() => {
            this.noSamePassword = true
          }, 100);
          setTimeout(() => {
            this.noSamePassword = false
          },2000);
        }else if(error.status == 400){
          console.log("Failed: bad request");
  
        }
            
      })
      this.passwordChange = ""
      this.emailPasswordChange = ""
    }
    
  }
  // LOGIN REQUEST
  login()
  {
    ///Ukucavamo primer@email.com vadimo username iz same adrese i saljemo beku
    if(this.emailLogin.search("@email.com") != -1){
      let extractUsername = this.emailLogin.split("@")
      this.userNameToSend = extractUsername[0]
      
      this.auth.login(this.userNameToSend, this.passwordLogin).subscribe((response) => {
        this.router.navigate(["/Dashboard"])
        
        this.data = {
          username: response.userDto.username,
          firstName: response.userDto.firstName,
          lastName: response.userDto.lastName,
          dob: response.userDto.dob
        };
        
        localStorage.setItem('user', JSON.stringify(this.data));
        localStorage.setItem('auth', btoa(this.userNameToSend + ":" + this.passwordLogin))
        localStorage.setItem('username', this.userNameToSend)
        this.emailLogin = ""
        this.passwordLogin = ""
      },
      (error: HttpErrorResponse) => {
          if(error.status == 401){
            console.log("Failed: credentials are incorrect");
            setTimeout(() => {
              this.badCredentials = true
            }, 100);
            setTimeout(() => {
              this.badCredentials = false
            }, 2000);
          }else
            console.log("Failed: Bad request");
      });
    }else{
      setTimeout(() => {
        this.wrongFormat = true
      }, 100);
      setTimeout(() => {
        this.wrongFormat = false
      }, 2000);
    }
  }
  //REGISTER REQUEST
  register()
  {
    if(this.emailRegister.search("@email.com")){
      let extractUsername = this.emailRegister.split("@")
      this.userNameToSend = extractUsername[0]
    }else this.userNameToSend = this.emailRegister
    
    if(this.passwordRegister.length >= 6){
      this.auth.register(this.userNameToSend, this.passwordRegister, this.firstNameRegister, this.lastNameRegister, this.dobRegister).subscribe((response) => {
        this.LoginForm = !this.LoginForm
        this.RegisterForm = !this.RegisterForm
        
        if(this.FlipForRegister == true){
          this.FlipForRegister = false
        }
        if(this.FlipForRegister == false){
          this.FlipForRegister = true
        }
    
        if(this.FlipForLogin == true){
          this.FlipForLogin = false
        }
        if(this.FlipForLogin == false){
          this.FlipForLogin = true
        }
        if(this.UserExist == true) this.UserExist = false;
        setTimeout(() => {
          this.succesRegistration = true
        }, 100);
        setTimeout(() => {
          this.succesRegistration = false
        }, 2000);
        
      },
      (error: HttpErrorResponse) => {
          if(error.status == 409){
            
            setTimeout(() => {
              this.UserExist = true
            }, 100);
            setTimeout(() => {
              this.UserExist = false
            }, 2000);
            
          }else
            console.log("Failed: Bad request");
      });
    }else {
      setTimeout(() => {
        this.weakPassword = true
      }, 100);
      setTimeout(() => {
        this.weakPassword = false
      }, 2000);
    }
    
    this.firstNameRegister = ""
    this.lastNameRegister = ""
    this.emailRegister = ""
    this.passwordRegister = ""
  }
}
