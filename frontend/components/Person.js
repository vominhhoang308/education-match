import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Avatar from 'material-ui/Avatar';
// import { Link } from 'react-router';
import Done from 'material-ui/svg-icons/action/done';
import Close from 'material-ui/svg-icons/navigation/close';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';

const styles = {
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: 10
  },
};
class Person extends Component {  
  
  constructor(){
    super();
    this.state= {
      done: false
    };
  }
  
  render() {
    var Invite;
    if(this.state.done){
      Invite = 
        <IconButton onClick={()=>{this.setState({done: false})}}
           iconStyle={{color: 'rgba(27, 197, 0, 0.870588)', width:'30px', height:'30px'}}>
            <Done/>
        </IconButton>
    } else {
      Invite = 
        <IconButton onClick={()=>{this.setState({done: true}); this.props.joinVisible()}}
           iconStyle={{width:'30px', height:'30px'}}>
            <Close/>
        </IconButton>
    }
    return (
      <div style={styles.wrapper}>
        {Invite}
        <Avatar src={this.props.image}/>
        <span style={{margin: 'auto 5px'}}>{this.props.name}</span>
        {this.props.chips.map((chip, index)=>{
          return <Chip style={styles.chip} key={index}>{chip}</Chip> 
        })}
      </div>
    );
  }
}

export default Person;