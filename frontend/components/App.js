import React, { Component } from 'react';
import NavLink from './NavLink';
import Avatar from 'material-ui/Avatar';
import styles from '../css/ownStyle.css';
import { Link } from 'react-router';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: "Minh"
    };
    this.changeName = this.changeName.bind(this);
  }

  changeName(newName) {
    this.setState({
      name: newName
    });
    localStorage.setItem('session', newName);
  }

  render() {
    return (
      <div className="container">
        <header>
          <span className="icn-logo"><i className="material-icons">code</i></span>
          <Link to="/profile">
            <Avatar className="avatar" src={`frontend/img/${this.state.name.toLowerCase()}.jpg`} />
          </Link>
          <span className="name">{this.state.name}</span>
          <ul className="main-nav">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/chat">Chat</NavLink></li>
            <li><NavLink to="/teachers">Teachers</NavLink></li>
            <li><NavLink to="/courses">Courses</NavLink></li>
          </ul>       
        </header>
        { this.props.children && React.cloneElement(this.props.children, {
          changeName: this.changeName
        })  }
      </div>
    );
  }
}

export default App;