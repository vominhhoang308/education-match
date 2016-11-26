// Libs
import React from 'react';
import { Router, Route, browserHistory, IndexRedirect } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Components
import App from './components/App';
import Home from './components/Home';
import Chat from './components/Chat';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import Teachers from './components/Teachers';
import NotFound from './components/NotFound';
import CourseContainer from './components/courses/CourseContainer';
import CourseList from './data/courses';
import Featured from './components/Featured';
import Profile from './components/Profile';

// Routes
const routes = (
  <MuiThemeProvider>
    <Router history={browserHistory}>
      <Route component={App}>
        <Route path="/" component={Home} />
        <Route path="chat" component={Chat} title="Chat" />
        <Route path="teachers" component={Teachers} />
        <Route path="courses" component={Courses}>
          <IndexRedirect to="html" />
          <Route path="html" component={CourseContainer} data={CourseList.HTML} />
          <Route path="css" component={CourseContainer} data={CourseList.CSS} />
          <Route path="javascript" component={CourseContainer} data={CourseList.JS} />
        </Route>
        <Route path="courseDetail" component={CourseDetail}/>
        <Route path="profile" component={Profile}/>
        <Route path="featured/:topic/:name" component={Featured} />
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  </MuiThemeProvider>
);

export default routes;





