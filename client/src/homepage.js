import React, { Component } from 'react';
import logo from './logo.svg';
import {Link} from 'react-router-dom';
import './homepage.css';


class homepage extends Component {
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
        <input id="search_input bar" className="in" type="text" ></input>
        <button className="notify"><img className="notimg" src='notification-icon.png'></img> </button>
        <button className="user"><Link to='/login'><img className="userimg" src='avatar.png'></img></Link> </button>
        <button className="search"><img className="searchimg" src='search.png'></img> </button>

        </div>  
        
        {/* Top buttons under menu bar */}
        <div className='top-buttons'>
        <button className="submit-buttons" id ="new-story" color="blue">New </button>
        <div className="black_line"></div>
        <button className="submit-buttons" id ="popular-stories" color="blue"> Popular</button>
        <button className="create-story" id ="create-story-button" color="blue"> create a story</button>
        </div>


      {/* Stories on the page */}
      <div className='stories'>

        <span className='story-cover1'>STORY 1</span>
        <span className='story-cover2'>STORY 2</span>
        <span className='story-cover3'> STORY 3</span>
        <span className='story-cover4'>STORY 4</span>

        <span className='story-cover5'>STORY 5</span>
        <span className='story-cover6'>STORY 6</span>
        <span className='story-cover7'> STORY 7</span>
        <span className='story-cover8'>STORY 8</span>

        <span className='story-cover9'>STORY 9</span>
        <span className='story-cover10'>STORY 10</span>
        <span className='story-cover11'> STORY 11</span>
        <span className='story-cover12'>STORY 12</span>
        

      </div>




      </div>
    );
  }
}

export default homepage;
