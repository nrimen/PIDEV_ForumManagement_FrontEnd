import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  nickname = '';
  ref = firebase.firestore().collection('users');
  matcher = new MyErrorStateMatcher();

  constructor(private router: Router, private formBuilder: FormBuilder) { 
    this.loginForm = this.formBuilder.group({
      'nickname' : [null, Validators.required]
    });
  }
  
  ngOnInit() {
    if (localStorage.getItem('nickname')) {
      this.router.navigate(['/roomlist']);
    }
  }

  onFormSubmit(form: any) {
    const login = form;
    this.ref.where('nickname', '==', login.nickname).get().then((querySnapshot: firebase.firestore.QuerySnapshot) => {
      if (!querySnapshot.empty) {
        localStorage.setItem('nickname', login.nickname);
        this.router.navigate(['/roomlist']);
      } else {
        const newUser = firebase.firestore().collection('users').doc();
        newUser.set(login);
        localStorage.setItem('nickname', login.nickname);
        this.router.navigate(['/roomlist']);
      }
    }).catch((error: any) => {
      console.error('Error searching for user:', error);
    });
  }
}
