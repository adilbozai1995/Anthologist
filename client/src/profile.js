import React, { Component } from 'react';
import logo from './logo.svg';
import { Link } from 'react-router-dom';


import './profile.css';


class profile extends Component {

  constructor () {
    super()
    this.state = {
      isHidden: true
    }
  }
  toggleHidden () {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }


  componentDidMount() {

    var account = this.props.match.params.account;

    var obj = JSON.stringify({
      "account":account
   });

    console.log(this.props)

     var xhttp = new XMLHttpRequest();
     xhttp.open("POST", "/api/fetch-profile" , true);
     xhttp.setRequestHeader("Content-Type", "application/json");
     xhttp.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200) {
       
          var response = JSON.parse(this.responseText);
          console.log(response);
          
          if (response.status === 'okay') {
            //update dom with new data           
            document.getElementById('n1').innerHTML = response.username;
            document.getElementById('user_description').innerHTML = response.description;
            var verify_return = response.verify;

            if(verify_return === ("verified")){
             //toggleHidden();              

            }

            if(localStorage.account === account) {
              document.getElementById('flag').parentNode.removeChild(document.getElementById('flag'));
            }
            else
            {
              document.getElementById('logout').parentNode.removeChild(document.getElementById('logout'));
            }

          }
          
        }
     };
     xhttp.send(obj);

  }

  onFlag() {

    var flag = this.props.match.params.account;

    var obj = JSON.stringify({
      "account":localStorage.account,
      "token":localStorage.token,
      "flag":flag
   });

    console.log(this.props)

     var xhttp = new XMLHttpRequest();
     xhttp.open("POST", "/api/flag-profile" , true);
     xhttp.setRequestHeader("Content-Type", "application/json");
     xhttp.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200) {
       
          var response = JSON.parse(this.responseText);
          console.log(response);
          
          if (response.status === 'okay') {
            
            document.getElementById('flag').parentNode.removeChild(document.getElementById('flag'));
          }
          
        }
     };
     xhttp.send(obj);

    
  }

  
onLogout() {
            
            localStorage.account = ""
            localStorage.token =""
    
        }

  render() {
    return (

      <div className="App">
      
        {/* Menu top bar */}
        <div className="notification-bar">

        {/* Anthologist logo */}
        <div className="head">
          <h1 className="head1">
          <Link to='/'><a className="logo" href>anthologist</a></Link>
          </h1>
        </div>
        
        {/* Search Bar */}
        <input className="in" type="text" ></input>
        <button className="notify"><img className="notimg" src='/notification-icon.png'></img> </button>
        <button className="user"><Link to='/login'><img className="userimg" src='/avatar.png'></img></Link> </button>
         <button className="search"><img className="searchimg" src='/search.png'></img> </button>

        </div>  

        <div>
          <button id ="verified" onClick={this.toggleHidden.bind(this)} className="ver"> Verify Email</button> {this.state.isHidden}
        
        </div>
        
        
            
            
        


        <div id ="2" className="Namecontainer">
            <div id = "n0" > <img className="Image" src='/avatar.png' ></img> </div> 
            <button id='flag' className="notify"><img className="notimg" src='/flg.png' onClick={() => this.onFlag()} ></img> </button>
            <Link to='/'><button className="create-story" id ="logout" color="blue" onClick={() => this.onLogout()}> logout</button></Link>
           
            <div id = "n1" className="Name"> <a className="name" href> </a> </div>
            <div id = "n2" className="Rating"> <a className="rating" href> Marks: 4.2 </a></div>
            
            <div id = "n3" className="Box"> 
                <div id = "user_description" className="typetext"> This is an example User Description</div>
            </div>
            
        </div> 

        <div id ="3" className="Contributioncontainer"> 
                <div id = "m0" className="contribution"> <a className="cont" href> Contributions </a></div> 



                <span className='btn'>STORY 1</span>
        <span className='btn'>STORY 2</span>
        <span className='btn2'> STORY 4</span>
        <span className='btn2'>STORY 3</span>

        <span className='btn'>Block A</span>
        <span className='btn'>Block B</span>
        <span className='btn2'>Block C</span>
        <span className='btn2'> Block D</span>
        


                </div>





      </div>




    );
  }
}

export default profile;