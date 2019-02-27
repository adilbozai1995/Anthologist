import React, { Component } from 'react';
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
  onLoginClicked()
  {
    var target = document.getElementById('email_id'); 
    var password = document.getElementById('login_password'); 
     console.log(target.value);
     console.log(password.value);
     document.getElementById('login_password').value = ""; 
     document.getElementById('email_id').value = ""; 

     //Password and username recived as text!
     


  }

  onSignUpClicked()
  {
    var target = document.getElementById('email_id_up'); 
    var password = document.getElementById('up_password'); 
    var username = document.getElementById('up_username'); 
     console.log(target.value);
     console.log(password.value);
     console.log(username.value);

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
        
        <div class="email_login_attributes">
        <label className='login-labels'> Email address  </label>
        <input type="text" id="email_id"/>
        </div>

      
        <div class="login_pass_attributes">
        <label className='login-labels'> Password  </label>
        <input type="password" id="login_password"/>
        </div>

        <div>
        <button id ="login_btn" onClick={() => this.onLoginClicked()} 
        color="blue">Submit</button>{' '}

        
        <button id= "forgot_btn" onClick={this.togglePopup.bind(this)}>Forgot it?</button>
        
        </div>

        </div>


       {/* SIGN UP SIDE */}

<<<<<<< HEAD
        <div className="sign_up_side">
        <h1 className= 'login-sign-up'>Sign Up</h1>
=======
        <div className="sign_up_side">  
        <h1>Sign Up</h1>
>>>>>>> 5a8036e5d447ef324e54aadeb0e7ffc5efc35505



        <div class="up_username_attributes">
        <label className='login-labels'> Username  </label>
        <input type="text" id="up_username"/>
        </div>

        
        <div class="email_up_attributes">
        <label className='login-labels' > Email address  </label>
        <input type="text" id="email_id_up"/>
        </div>

        <div class="up_pass_attributes">
        <label className='login-labels' > Password  </label>
        <input type="password" id="up_password"/>
        </div>

        <div>
        <button id ="up_btn" onClick={() => this.onSignUpClicked()} 
        color="blue">Submit</button>{' '}

        </div>


        </div>
        
        </div>  
        
        {/* Menu top bar */}
        <div className="notification-bar">

        {/* Anthologist logo */}
        <div className="head">
          <h1 className="head1">
            <a className="logo" href>anthologist</a>
          </h1>
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
