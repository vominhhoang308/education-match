// Libs
import React from 'react';
import { render } from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

// CSS 
import './frontend/css/style.css';
import './frontend/css/style_chatbox.css';
import './frontend/css/normalize.css';


// Routes
import routes from './frontend/router';

// Render
render(
  routes, 
  document.getElementById('root')
);










