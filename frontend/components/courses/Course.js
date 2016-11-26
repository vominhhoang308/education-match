import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Link} from "react-router";

const Course = props => (
  <li className="course media group">
    <img className="course-img" src={props.img} />
    <div>
      <h3>{props.title}</h3>
      <p>{props.desc}</p>
      <Link to="/courseDetail"><RaisedButton label="Join course" primary={true} /></Link>
    </div>
  </li>
);

export default Course;