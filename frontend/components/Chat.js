import React, { Component } from 'react';
import Phone from 'material-ui/svg-icons/communication/phone';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';

class Chat extends Component {
  constructor(){
    super();
    this.state = {
      message:"",
      sent: false
    };
    this.handleText = this.handleText.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }
  handleText(e){
    this.setState({message: e.target.value});
  }
  sendMessage(){
    this.setState({sent: true, message: ""});
  }
  render() {
    var Sent;
    if(this.state.sent){
      Sent =             
      <div className="message-wrapper me">
        <Avatar style={{float:'right'}} src="frontend/img/hoang.jpg"/>
        <div className="text-wrapper animated fadeIn">Hi Minh. What's your favorite band or singer ?</div>
      </div>;
    }
    return (
      <div className="wrapper" style={{position:'relative', top:0}}>
        <nav id="nav" className="nav">
          <div className="default-nav">
            <div className="main-nav">
              <div className="toggle"></div>
              <span style={{margin: 'auto 0'}}>Hoang, Kaisa, Minh</span>
              <IconButton style={{ margin: '10px 0px 10px 50px'}} iconStyle={{color: 'white'}}>
                <Phone/>
              </IconButton>
            </div>
          </div>
        </nav>
        <div id="inner" className="inner">
          <div id="content" className="content">
            <div className="message-wrapper them">
              <Avatar style={{float:'left'}} src="frontend/img/minh.jpg"/>
              <div className="text-wrapper animated fadeIn sender">Hello everyone, my name is Minh Cao. I am from Vietnam, I love modern arts and milk is my favorite drink.</div>
            </div>
            {Sent}            
          </div>
        </div>
        <div id="bottom" className="bottom">
          <textarea id="input" className="input" value={this.state.message} onChange={this.handleText}></textarea>
          <div id="send" className="send" onTouchTap={this.sendMessage}></div>
        </div>
      </div>
    );
  }
}

export default Chat;