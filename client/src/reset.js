import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './reset.css';

import logo from './logo.svg';
import {Link} from 'react-router-dom';
import './homepage.css';


class reset extends Component {
  onChangePass(){

    var password= document.getElementById('reset_password').value;
    
    var key = "gf";
   
    document.getElementById('reset_password').value = "";
   
    var account = this.props.match.params.account;

    var obj = JSON.stringify({"account":account,"reset":key, "password":password});
   

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/api/reset" , true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function () {
       if(this.readyState === 4 && this.status === 200) {
      
         var response = JSON.parse(this.responseText);
         console.log(response);

         if (response.status === 'okay') {
           localStorage.token = response.token;
           localStorage.account = response.account;
           window.location.replace("/profile/" + response.account)
         }


       }
    };
    xhttp.send(obj);

  }

  render() {
    return (

        <div className="App">
        
        {/* Menu top bar */}
        <div className="notification-bar">

        {/* Anthologist logo */}
        <div className="head">
          <h1 className="head1">
          <Link to='/'><a className="logo" href>anthologist</a></Link></h1>
        </div>
        
        {/* Search Bar */}
        <input id="search_input bar" className="in" type="text" ></input>
        <button className="notify"><img className="notimg" src='notification-icon.png'></img> </button>
        <button className="user"><img className="userimg" src='avatar.png'></img> </button>
         <button className="search"><img className="searchimg" src='search.png'></img> </button>

        </div>

        
        <div className="box">
        

        <div class="reset_pass">
        <label className='login-labels'> Enter New Password                             </label>
        <input className='label-inputs' type="password" id="reset_password"/>
        <button className="submit-buttons" id ="up_btn" onClick={() => this.onChangePass()} 
        color="blue">Submit</button>{' '}
        

        </div>

        </div>

        
        </div>

    );
  }
}

export default reset;
