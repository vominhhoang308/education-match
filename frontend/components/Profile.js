import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';

class Profile extends Component {
  constructor(){
    super();
    this.state = {
    };
  }
  render() {
    var ProfileContent;
    var session = localStorage.getItem("session");
    if(session == "Hoang"){
      ProfileContent = 
      <div>
        <div style={{width: '40%', float:'left'}}>
          <Avatar src="frontend/img/hoang.jpg" style={{width:'200px', height:'auto'}}/>
        </div>
        <div style={{width: '60%', float:'right'}}>
          <h2>Hoang Vo</h2>
          <p>Location: Finland</p>
          <p>Passion: Media and Photography</p>
          <p>Hobbies: Movies, Arts</p>
          <p>Favorite food: Chicken</p>
        </div>
      </div>;
    } else {
      ProfileContent = 
      <div>
        <div style={{width: '40%', float:'left'}}>
          <Avatar src="frontend/img/minh.jpg" style={{width:'200px', height:'auto'}}/>
        </div>
        <div style={{width: '60%', float:'right'}}>
          <h2>Minh Cao</h2>
          <p>Location: Vietnam</p>
          <p>Passion: Modern arts</p>
          <p>Hobbies: Basketball</p>
          <p>Favorite drink: Milk</p>
        </div>
      </div>;
    }
    return (
      <div style={{margin:'5%'}}>
      <h1>Personal profile</h1>
      {ProfileContent}
      </div>
    );
  }
}

export default Profile;