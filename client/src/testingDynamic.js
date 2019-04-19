import React, { Component } from 'react';

import logo from './logo.svg';
import ReactDOM from 'react-dom';


class testingDynamic extends React.Component {

    state = {
        value : {},
        blocks: [{index: 1, block : "Block1"}, {index: 2, block: "Block2"},{index: 3, block: "Block3"}]
    }

    //Function to add a block
    onAddItem = () =>{
        this.setState(state => {
            const blocks = state.blocks.concat(state.value);
            return {
                blocks,
                value:{},
            };
        });
    };

    render() {
        return (
            // Story Box where each block gets added
             <div className='story-div' >
            {
                // Iterates over each element in the blocks array in the state and makes a span
              this.state.blocks.map(({block,index})=>{
                return (
                  <span key={index.toString()} className='block' >{block}
                    <button>LIKE</button>
                  </span>
                )
              })
            }

            {/* Button to add a block */}
            <button
          type="button"
          onClick={this.onAddItem}
          disabled={!this.state.value}
        >
          Add
        </button>
            </div>
        )
    }
  }

  export default testingDynamic;
