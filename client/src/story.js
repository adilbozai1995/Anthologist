import React, { Component } from 'react';
import { Link,Prompt } from 'react-router-dom';
import './story.css';


class Popup extends React.Component {
    ViewStory(){


    }

    submit()
    {
        if ( !localStorage.account || !localStorage.token || !sessionStorage.mystory ) return;

        var story = sessionStorage.mystory

        var vtime = document.getElementById("vote_time").value
        document.getElementById("vote_time").value = ""

        var obj = JSON.stringify({
            "account": localStorage.account,
            "token": localStorage.token,
            "story": story,
            "votetime": vtime
        })

        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/api/story-editvote" , true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.onreadystatechange = function ()
        {
            if ( this.readyState === 4 && this.status === 200 )
            {
                var response = JSON.parse(this.responseText);
                console.log(response);

                if ( response.status === 'okay' )
                {
                    document.getElementById('votesTime').innerHTML = "Vote Time (minutes): " + vtime
                }
            }
        };
        xhttp.send(obj);
    }

  render() {
    return (
      <div className='popup_view_story'>
        <div className='popup_inner_story'>

        <div><span className='st'>Enter new voting time : </span>
                <input className='input_new' type="text" id="vote_time"/>
            </div>
        <button onClick={() => this.submit()}>Submit</button>
        <button onClick={this.props.closePopup}>Done</button>
        </div>
      </div>
    );
  }
}


class story extends Component {
  
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
  
  onBookmarkClicked(){
    if ( !localStorage.account || !localStorage.token ) return;

    var story = this.props.match.params.story;

    var obj = JSON.stringify({
        "account": localStorage.account,
        "token": localStorage.token,
        "story": story
    });

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/api/story-bookmark" , true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function ()
    {
        if ( this.readyState === 4 && this.status === 200 )
        {
            var response = JSON.parse(this.responseText);
            console.log(response);

            if ( response.status === 'okay' )
            {

            }
        }
    };
    xhttp.send(obj);
  }

  componentDidMount()
  {
    var story = this.props.match.params.story;

    sessionStorage.mystory = story

    var obj = JSON.stringify({
        "story":story
    });

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/api/story-fetch" , true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function ()
    {
        if ( this.readyState === 4 && this.status === 200 )
        {

            var response = JSON.parse(this.responseText);
            console.log(response);

            if ( response.status === 'okay' )
            {
                document.getElementById('story-title').innerHTML = response.title
                document.getElementById('charLimit').innerHTML = "Character Limit: " + response.charlimit
                document.getElementById('minBl').innerHTML = "Min Story Len: " + response.storylen
                document.getElementById('votesLimit').innerHTML = "Min Blocks for Vote: " + response.minblock
                document.getElementById('votesTime').innerHTML = "Vote Time (minutes): " + response.votetime
                document.getElementById('nViews').innerHTML = response.views + " Views"
            }
        }
     };
     xhttp.send(obj);

  }

  onFlag2()
  {
    if ( !localStorage.account || !localStorage.token ) return;

    var story = this.props.match.params.story;

    var obj = JSON.stringify({
        "account": localStorage.account,
        "token": localStorage.token,
        "flag": story
    });

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/api/story-flag" , true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function ()
    {
        if ( this.readyState === 4 && this.status === 200 )
        {
            var response = JSON.parse(this.responseText);
            console.log(response);

            if ( response.status === 'okay' )
            {

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
        <button className="notify"><img className="notimg" src='/notification-icon.png'></img> </button>
        <button className="user"><Link to='/login'><img className="userimg" src='/avatar.png'></img></Link> </button>
         <button className="search"><img className="searchimg" src='/search.png'></img> </button>

        </div>



        {/* Title of story */}
        <div id="story-title" className="StoryTitle"> Working Title<a className="title" href> </a> </div>

        {/* Blocks */}
        <div className='blocks-container'>
            <div className='blocks'>
                <button className='st' >Completed Block 1</button>
                <div className='author'>Author</div>
                <div className='slash'>/</div>
                <div className='likes'>Likes</div>


            </div>
            <div className='blocks'>
            <button className='st'>Completed Block 2</button>
                <div className='author'>Author</div>
                <div className='slash'>/</div>
                <div className='likes'>Likes</div>


            </div>
            <div className='blocks'>
            <button className='st'>Completed Block 3</button>
                <div className='author'>Author</div>
                <div className='slash'>/</div>
                <div className='likes'>Likes</div>


            </div>
            <div className='blocks'>
            <button className='st'>Completed Block 4</button>
                <div className='author'>Author</div>
                <div className='slash'>/</div>
                <div className='likes'>Likes</div>


            </div>
        </div>

        {/* Number of Likes */}
        <div className='nOfLikes'>400 Likes</div>

        {/* Number of Views */}
        <div className='nOfViews' id='nViews'>100 Views</div>


        {/* Book Logo */}
        <div className='book-logo'>
         <img className="bookimg" src='/book.png' ></img>
        </div>
         

        {/* Attributes */}
        <div className='attributesBlock'>
        <h1 className='attributes'>Attributes</h1>

        <div className='cLimit' >
        <span id='charLimit' className='st4'></span>

        </div>
          <div className='minBlocks'>
            <span id='minBl' className='st4'></span>
          </div>
          <div className='vLimit'>
          <span id='votesLimit' className='st4'></span>

          </div>
          <div className='vTime' >
          <span id='votesTime' className='st4'></span>
          </div>
        </div>

        {/* Change Time Button */}
        <button className="changeTimeButton" id ="changeTime" onClick={this.togglePopup.bind(this)} color="blue">Change Vote Time </button>
        
        {/* Flag button */}
                    <button id='flagID' className="flagStory"><img className="flagimg" src='/flg.png' onClick={() => this.onFlag2()} ></img> </button>


        {/* Proposed Blocks */}
        <div className='proposed'>
            <div className='p-blocks'>
                <span className='st1'>Proposed Block 1</span>
                <div className='author1'>Author</div>
                <div className='slash1'>/</div>
                <div className='likes1'>Likes</div>


            </div>
              <div className='p-blocks'>
                <span className='st1'>Proposed Block 2</span>
                <div className='author1'>Author</div>
                <div className='slash1'>/</div>
                <div className='likes1'>Likes</div>

            </div>
            <div className='p-blocks'>
                <span className='st1'>Proposed Block 3</span>
                <div className='author1'>Author</div>
                <div className='slash1'>/</div>
                <div className='likes1'>Likes</div>
            </div>
            
        </div>

        {/* Add Block Button */}
        <button className="addAButton" id ="addAButtonID" color="blue">Add a block </button>
       
        {/* Add a bookmark button */}
        <button className="bookmark"><img className="bkimg" onClick={() => this.onBookmarkClicked()} src='/bookmark.png'></img> </button>

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

export default story;
