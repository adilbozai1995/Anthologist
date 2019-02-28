import React, { Component } from 'react';
import logo from './logo.svg';
import { Link } from 'react-router-dom';


import './profile.css';


class profile extends Component {

  


  componentDidMount() {

    

    var obj = JSON.stringify({
      "account":this.props.match.params.account
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
           
            document.getElementById('n1').innerHTML = response.username;
            document.getElementById('user_description').innerHTML = response.description;


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
          <Link to='/'><a className="logo" href>anthologist</a></Link>
          </h1>
        </div>
        
        {/* Search Bar */}
        <input className="in" type="text" ></input>
        <button className="notify"><img className="notimg" src='/notification-icon.png'></img> </button>
        <button className="user"><img className="userimg" src='/avatar.png'></img> </button>
         <button className="search"><img className="searchimg" src='/search.png'></img> </button>

        </div>  
        
      


        <div id ="2" className="Namecontainer">
            <div id = "n0" > <img className="Image" src='/avatar.png' ></img> </div> 
           
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
        

        
         
                        {/* <a href="https://www.google.com/"><button type="publish" class="btn" >Button1</button></a>
                        <a href="https://www.google.com/"><button class="btn">Button2</button></a>

                        <button type="submit" class="btn2" >Button3</button>
                        <button type="publish" class="btn2" >Button4</button>
                        <button class="btn2">Back2</button>

                        <a href="https://www.google.com/"><button type="publish" class="btn" >Button5</button></a>
                        <a href="https://www.google.com/"><button class="btn">Button6</button></a>

                        <button type="submit" class="btn2" >Button7</button>
                        <button type="publish" class="btn2" >Publish6</button>
                        <button class="btn2">Back5</button> */}

                </div>





      </div>




    );
  }
}

export default profile;
