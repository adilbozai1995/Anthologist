import React, { Component } from 'react';
import { Link,Prompt } from 'react-router-dom';
import './login.css';

class Popup extends React.Component {
  onForgotSendClicked(){
    var email_reset = document.getElementById('email_reset_mail');
     console.log(email_reset.value);
  }
  render() {
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <h1>Reset Password</h1>
          <label> Send Email  </label>
        <input type="text" id="email_reset_mail"/>
        <button id ="send_mail_btn" onClick={() => this.onForgotSendClicked()}
        color="blue">Send Email</button>{' '}
        <button onClick={this.props.closePopup}>Done</button>
        </div>
      </div>
    );
  }
}


class login extends Component {
  
constructor() {
    super();
    this.state = {
      showPopup: false
    };
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  componentDidMount() {

    if ( !localStorage.account || !localStorage.token ) return;

    var obj = JSON.stringify({
      "account":localStorage.account,
      "token":localStorage.token,
    });

     var xhttp = new XMLHttpRequest();
     xhttp.open("POST", "/api/validate" , true);
     xhttp.setRequestHeader("Content-Type", "application/json");
     xhttp.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200) {
       
          var response = JSON.parse(this.responseText);
          console.log(response);
          
          if (response.status === 'okay') {
            window.location.replace("/profile/" + localStorage.account)
          }
          else
          {
            localStorage.account = ""
            localStorage.token = ""
          }
        }
     };
     xhttp.send(obj);

  }


  onLoginClicked()
  {
     var target = document.getElementById('email_id').value;
     var password = document.getElementById('login_password').value;
    //  console.log(target.value);
    //  console.log(password.value);
     document.getElementById('login_password').value = "";
     document.getElementById('email_id').value = "";

     var obj = JSON.stringify({"email":target, "password":password});
    //  console.log(obj);

     var xhttp = new XMLHttpRequest();
     xhttp.open("POST", "/api/login" , true);
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

     //Password and username recived as text!
     


  }

  onSignUpClicked()
  {
    var email = document.getElementById('email_id_up').value; 
    var password = document.getElementById('up_password').value; 
    var username = document.getElementById('up_username').value; 

     var obj = JSON.stringify({"username":username, "password":password, "email":email});

     var xhttp = new XMLHttpRequest();
     xhttp.open("POST", "/api/signup" , true);
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



     document.getElementById('up_username').value = ""; 
     document.getElementById('up_password').value = ""; 
     document.getElementById('email_id_up').value = ""; 
     //Password and username recived as text!
     


  }



  render() {
    return (
       
      

      <div className="App">
      
        
        <div className="box">
        <div className="black_line"></div>
        
        <div className="login_side"> 
        <h1 className= 'login-sign-up'>Login</h1>
        
        <div class="label-div">
        <label className='login-labels'> Email address  </label>
        <input className='label-inputs' type="text" id="email_id"/>
        </div>

      
        <div class="label-div">
        <label className='login-labels'> Password  </label>
        <input className='label-inputs' type="password" id="login_password"/>
        </div>

        <div>
        <button className="submit-buttons" id ="login_btn" onClick={() => this.onLoginClicked()} 
        color="blue">Submit</button>{' '}

        
        <button className="submit-buttons" id= "forgot_btn" onClick={this.togglePopup.bind(this)}>Forgot it?</button>
        
        </div>

        </div>


       {/* SIGN UP SIDE */}

        <div className="sign_up_side">  
        <h1 className= 'login-sign-up' >Sign Up</h1>



        <div class="label-div">
        <label className='login-labels'> Username   </label>
        <input className='label-inputs' type="text" id="up_username"/>
        </div>

        
        <div class="label-div">
        <label className='login-labels' > Email address  </label>
        <input className='label-inputs' type="text" id="email_id_up"/>
        </div>

        <div class="label-div">
        <label className='login-labels' > Password  </label>
        <input className='label-inputs' type="password" id="up_password"/>
        </div>

        <div>
        <button className="submit-buttons" id ="up_btn" onClick={() => this.onSignUpClicked()} 
        color="blue">Submit</button>{' '}

        </div>


        </div>
        
        </div>  
        
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
        
        
 
         {this.state.showPopup ? 
          <Popup
            text='Close Me'
            closePopup={this.togglePopup.bind(this)}
          />
          : null
        }

      </div>
 

    ); 

    
  

  }
}

export default login;
