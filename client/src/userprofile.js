import React, { Component } from 'react';
import logo from './logo.svg';
import { Link } from 'react-router-dom';


import './userprofile.css';


class userprofile extends Component {
  render() {
    return (

      <div className="App">
      
        {/* Menu top bar */}
        <div className="notification-bar">

        {/* Anthologist logo */}
        <div className="head">
          <h1 className="head1">
            <a className="logo" href>anthologist</a>
          </h1>
        </div>
        
        {/* Search Bar */}
        <input className="in" type="text" ></input>
        <button className="notify"><img className="notimg" src='notification-icon.png'></img> </button>
        <button className="user"><img className="userimg" src='avatar.png'></img> </button>
         <button className="search"><img className="searchimg" src='search.png'></img> </button>

        </div>  
        
      


        <div id ="2" className="Namecontainer">
            <div id = "n0" > <img className="Image" src='avatar.png' ></img> </div> 
           
            <div id = "n1" className="Name"> <a className="name" href> Alexa Charles </a> </div>
            <div id = "n2" className="Rating"> <a className="rating" href> Marks: 4.2 </a></div>
            
            <div id = "n3" className="Box"> 
                <div className="typetext"> This is an example User Description</div>
            </div>
            
        </div> 

        <div id ="3" className="Contributioncontainer"> 
                <div id = "m0" className="contribution"> <a className="cont" href> Contributions </a></div> 



                <span className='btn'>STORY 1</span>
        <span className='btn'>STORY 2</span>
        <span className='btn2'> STORY 4</span>
        <span className='btn2'>STORY 3</span>

        <span className='btn'>STORY 5</span>
        <span className='btn'>STORY 6</span>
        <span className='btn2'>STORY 8</span>
        <span className='btn2'> STORY 7</span>
        

        
         
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

export default userprofile;
