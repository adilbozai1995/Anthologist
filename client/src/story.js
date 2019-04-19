import React, { Component } from 'react';
import { Link,Prompt } from 'react-router-dom';
import './story.css';
import Modal from 'react-modal'

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
      showPopup: false,
      value : {},
      blocks:[],
      proposed:[]
    };
  }

   /*Modal declared*/
   state = {
    StoryIsOpen: false,
    secondModalIsOpen: false,
    addBlockIsOpen:false
  };

  StoryopenModal = (storyText) => {
    this.setState({ StorymodalIsOpen: true, StoryModalText: storyText });
  };

  StorycloseModal = () => {
    this.setState({ StorymodalIsOpen: false });
  };

  openSecondModal = () => {
    this.setState({ secondModalIsOpen: true });
  };

  closeSecondModal = () => {
    this.setState({ secondModalIsOpen: false });
  };
  open_addBlock = () => {
    this.setState({ addBlockIsOpen: true });
  };

  close_addBlock = () => {
    this.setState({ addBlockIsOpen: false });
  };
  

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
    sessionStorage.canEndStory = false;

    var obj = JSON.stringify({
        "story":story
    });

    const updateBlock = this.onAddItem;

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
                document.getElementById('nLikes').innerHTML = response.rating + " Likes"

                if ( response.ended )
                {
                    document.getElementById('nCount').innerHTML = "Story has ended"
                }
                else if ( response.votemode )
                {
                    setInterval( function()
                    {
                        var seconds = Math.max( (response.votestart + (response.votetime * 60 )) - (Date.now() / 1000), 0 )
                        var minutes = Math.floor( seconds / 60 )
                        seconds = seconds % 60
                        var hours = Math.floor( minutes / 60 )
                        minutes = minutes % 60

                        seconds = Math.floor( seconds )

                        if ( hours > 0 )
                        {
                            document.getElementById('nCount').innerHTML = hours + ":" + minutes + ":" + seconds + " Until voting ends";
                        }
                        else if ( minutes > 0 )
                        {
                            document.getElementById('nCount').innerHTML = minutes + ":" + seconds + " Until voting ends";
                        }
                        else
                        {
                            document.getElementById('nCount').innerHTML = seconds + " Until voting ends";
                        }

                    }, 1000 );
                }
                else
                {
                    var blockCount = 0;

                    for ( var i = 0; i < response.blocks.length; i++ )
                    {
                        if ( response.blocks[i].iteration === response.iteration )
                        {
                            blockCount++;
                        }
                    }

                    blockCount = Math.max( response.minblock - blockCount, 0 )

                    document.getElementById('nCount').innerHTML = blockCount + " Blocks until voting starts"
                }

                // Check if we can end the story
                if ( response.iteration >= response.storylen ) sessionStorage.canEndStory = true;

                for ( var i = 0; i < response.blocks.length; i++ )
                {
                    var cblock = response.blocks[i]

                    var endingColor = "white";
                    if ( cblock.ending ) endingColor = "red";

                    updateBlock({
                        "id":cblock.id,
                        "iteration":cblock.iteration,
                        "content":cblock.content,
                        "author":cblock.author,
                        "username":cblock.username,
                        "flag":cblock.flag,
                        "rating":cblock.rating,
                        "ending":endingColor
                    }, cblock.iteration < response.iteration );
                }
            }
            else
            {
                window.location.replace("/")
            }
        }
        else if ( this.status === 400 )
        {
            window.location.replace("/")
        }
     };
     xhttp.send(obj);
  }

  onAddBlock(){   /*UPDATE THE STORY HERE*/

    if ( !localStorage.account || !localStorage.token ) return;

    var story = this.props.match.params.story;

    var ending = 0;
    if ( document.getElementById("eos_check").checked ) ending = 1;

    var obj = JSON.stringify({
        "account": localStorage.account,
        "token": localStorage.token,
        "story": story,
        "text": document.getElementById("new_block").value,
        "ending": ending
    });

    document.getElementById("new_block").value = "";
    document.getElementById("eos_check").checked = false;

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/api/block-create", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function ()
    {
        if ( this.readyState === 4 && this.status === 200 )
        {
            var response = JSON.parse(this.responseText);
            console.log(response);

            if ( response.status === 'okay' )
            {
                // Refreshing is the easiest way
                window.location.reload()
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

  //-----------------------FUNCTION TO ADD A BLOCK DYNAMICALLY-------------------------
  onAddItem = ( updateVal, regblock ) =>{
    this.setState(state => {
        if ( !regblock )
        {
            const proposed = state.proposed.concat(updateVal);
            return {
                proposed,
                value:{},
            };
        }
        else
        {
            const blocks = state.blocks.concat(updateVal);
            return {
                blocks,
                value:{},
            };
        }
    });
};
//-----------------------------------------------------------------------------------------

// -----LIKE BUTTON FUNCTION------
onClickLike = (blockId) => {

    if ( !localStorage.account || !localStorage.token ) return;

    var obj = JSON.stringify({
        "account": localStorage.account,
        "token": localStorage.token,
        "block": blockId
    });

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/api/block-vote" , true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function ()
    {
        if ( this.readyState === 4 && this.status === 200 )
        {
            var response = JSON.parse(this.responseText);
            console.log(response);

            if ( response.status === 'okay' )
            {
                window.location.reload()
            }
        }
    }
    xhttp.send(obj)
}

// -----FLAG BUTTON FUNCTION------
onClickFlag(id) {

}

//-----DELETE BUTTON FUNCTION------
onClickDelete(id) {

}

//-----EDIT BUTTON FUNCTION------
onClickEdit(id) {

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
        
        <button className="user"><Link to='/login'><img className="userimg" src='/man.png'></img></Link> </button>
        

        </div>



        {/* Title of story */}
        <div id="story-title" className="StoryTitle"> Working Title<a className="title" href> </a> </div>
        

        {/* ------------DYNAMICALLY COMPLETED BLOCKS---------------- */}
        <div className='blocks-container'>
            {
              this.state.blocks.map(({id, iteration, content, author, username, flag, rating, ending}) =>{
                return(
                  <div className='blocks' key={id.toString()} style={{"border-color":ending.toString()}}>
                      <button onClick={() => this.StoryopenModal(content)} className='st'>{content.toString().substring(0,15) + " ..."}</button>
                      <a href={"/profile/" + author.toString()} className='author'>{username.toString()}</a>
                      <div className='slash'>/</div>
                      <button className="likeButton2" onClick={() => this.onClickLike(id)} ><i id="like" className="far fa-thumbs-up fa-2x"></i></button>
                      <div className='likes'>{rating.toString()} Likes</div>
                  </div>
                )
              })
            }
        </div>
        {/* ----------------------------------------------------------- */}

        {/* Number of Likes */}
        <div className='nOfLikes' id='nLikes'>400 Likes</div>

        {/* Number of Views */}
        <div className='nOfViews' id='nViews'>100 Views</div>

        {/* Countdown */}
        <div className='n1Count' id='nCount'>100 Min</div>


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


        {/* ------------DYNAMICALLY PROPOSED BLOCKS---------------- */}
        <div className='proposed'>
        {
              this.state.proposed.map(({id, iteration, content, author, username, flag, rating, ending}) =>{
                return(
                  <div className='p-blocks' key={id.toString()} style={{"border-color":ending.toString()}}>
                      <button onClick={() => this.StoryopenModal(content)} className='st1'>{content.toString().substring(0,15) + "..."}</button>
                 <a href={"/profile/" + author.toString()} className='author1'>{username.toString()}</a>
                      <div className='slash1'>/</div>
                      <button className="likeButton3" onClick={() => this.onClickLike(id)} ><i id="like" className="far fa-thumbs-up fa-2x"></i></button>
                      <button className="flagButton" onClick={() => this.onClickFlag(id)} ><i id="flag" className="far fa-flag fa-2x"></i></button>
                      <button className="deleteButton" onClick={() => this.onClickDelete(id)} ><i id="delete" className="fas fa-trash-alt fa-2x"></i></button>
                      <button className="editButton" onClick={() => this.onClickEdit(id)} ><i id="edit" className="fas fa-edit fa-2x"></i></button>

                      <div className='likes1'>{rating.toString()} Likes</div>
                  </div>
                )
              })
            }

            {/* ----------------------------------------------------------- */}

            {/* <div className='p-blocks'>
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

            </div> */}
            
            
        </div>

        {/* Add Block Button */}
        <button className="addAButton" onClick={this.open_addBlock} id="addAButtonID" color="blue">Add a block</button>
       
        {/* Add a bookmark button */}
        <button className="bookmark"><img className="bkimg" onClick={() => this.onBookmarkClicked()} src='/bookmark.png'></img> </button>


        

        {this.state.showPopup ? 
          <Popup
            text='Close Me'
            closePopup={this.togglePopup.bind(this)}
          />
          : null
        }

      
      <Modal /*THIS A STORY YOU NEED TO CHANGE*/
          isOpen={this.state.StorymodalIsOpen} onRequestClose={this.StorycloseModal}>
          <button onClick={this.StorycloseModal}>close</button>
          <div>{this.state.StoryModalText}</div>
        </Modal>

        <Modal
          isOpen={this.state.secondModalIsOpen}
          onRequestClose={this.closeSecondModal}
        >
          <button onClick={this.closeSecondModal}>close</button>
          <div>No dude</div>
        </Modal>


        <Modal
          isOpen={this.state.addBlockIsOpen}
          onRequestClose={this.close_addBlock}
        >

        <div class="change-description">
        <label className='change-descp' > Add Block   </label>
        <textarea className='add_block'  type="text" id="new_block"/>
        </div>
        <button onClick={() => this.onAddBlock()}>Add Block</button>
        <label>
        <input type="checkbox" id="eos_check" disabled={!sessionStorage.canEndStory} value="ES" />
        End of Story
      </label>

        <button onClick={this.close_addBlock}>close</button>

        </Modal>

      </div>

    );

  }
}

export default story;
