import React, { Component } from 'react';

import './profile.css';
// import logo from '/Users/taimoorjaved/myanthologist/src/dummy.png'


class profile extends Component {
  render() {
    return (
      <div className="App">
      
        <div id ="1" className="notification-bar"> <a className="logo" href>anthologist</a>  </div>
        <div id ="2" className="Namecontainer">
            <div id = "n0" className="Image"/> 
           
            <div id = "n1" className="Name"> <a className="name" href> Alexa Charles </a> </div>
            <div id = "n2" className="Age"> <a className="age" href> Marks: 4.2 </a></div>
            
            <div id = "n3" className="Box"> 
                <input className="typetext" type ="text" />
            </div>
            
        </div> 
        <div id ="3" className="Contributioncontainer"> 
                <div id = "m0" className="contribution"> <a className="cont" href> Contributions </a></div> 
         
                        <a href="https://www.google.com/"><button type="publish" class="btn" >Button1</button></a>
                        <a href="https://www.google.com/"><button class="btn">Button2</button></a>

                        <button type="submit" class="btn2" >Button3</button>
                        <button type="publish" class="btn2" >Button4</button>
                        <button class="btn2">Back2</button>

                        <a href="https://www.google.com/"><button type="publish" class="btn" >Button5</button></a>
                        <a href="https://www.google.com/"><button class="btn">Button6</button></a>

                        <button type="submit" class="btn2" >Button7</button>
                        <button type="publish" class="btn2" >Publish6</button>
                        <button class="btn2">Back5</button>

                </div>



     </div>

    );
  }
}

export default profile;