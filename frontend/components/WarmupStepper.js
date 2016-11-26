import React from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import TextField from 'material-ui/TextField';
import { WithContext as ReactTags } from 'react-tag-input';
import Person from "./Person";
import Phone from 'material-ui/svg-icons/communication/phone';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';

/**
 * A contrived example using a transition between steps
 */
class WarmupStepper extends React.Component {

  constructor(){
    super();
    this.state = {
      loading: false,
      finished: false,
      stepIndex: 0,
      tags: [],
      suggestions: ["Geography", "Finland", "Music"],
      joinGroup: false,
      hasJoined: false,
      people: [
        {
          name: "Hoang",
          image: "frontend/img/hoang.jpg",
          chips: ["Music", "Finland", "Basketball", "Programming"]
        },
        {
          name: "Pirjo",
          image: "frontend/img/pirjo.jpg",
          chips: ["Music", "Finland", "Education", "Learning", "People"]
        },
        {
          name: "Tri",
          image: "frontend/img/tri.jpg",
          chips: ["Music", "Finland", "Soccer"]
        },
        {
          name: "Kaisa",
          image: "frontend/img/kaisa.jpg",
          chips: ["Music", "Finland", "Movies", "Education"]
        },
      ]
    }

    this.dummyAsync = this.dummyAsync.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.getStepContent = this.getStepContent.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.joinVisible = this.joinVisible.bind(this);
  }

  joinVisible(){
    this.state.joinGroup = true;
    this.setState(this);
  }

  dummyAsync(cb) {
    this.setState({loading: true}, () => {
      this.asyncTimer = setTimeout(cb, 500);
    });
  };

  handleDelete(i) {
      let tags = this.state.tags;
      tags.splice(i, 1);
      this.setState({tags: tags});
  }

  handleAddition(tag) {
      let tags = this.state.tags;
      tags.push({
          id: tags.length + 1,
          text: tag
      });
      this.setState({tags: tags});
  }

  handleDrag(tag, currPos, newPos) {
      let tags = this.state.tags;

      // mutate array
      tags.splice(currPos, 1);
      tags.splice(newPos, 0, tag);

      // re-render
      this.setState({ tags: tags });
  }

  handleNext() {
    const {stepIndex} = this.state;
    if (!this.state.loading) {
      this.dummyAsync(() => this.setState({
        loading: false,
        stepIndex: stepIndex + 1,
        finished: stepIndex >= 1,
      }));
    }
  };

  handlePrev() {
    const {stepIndex} = this.state;
    if (!this.state.loading) {
      this.dummyAsync(() => this.setState({
        loading: false,
        stepIndex: stepIndex - 1,
      }));
    }
  };

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <div>
            <ReactTags tags={this.state.tags}
                suggestions={this.state.suggestions}
                handleDelete={this.handleDelete}
                handleAddition={this.handleAddition}
                handleDrag={this.handleDrag} />
            <p>Add topics or interests to find like-minded classmates</p>
          </div>
        );
      case 1:
        return (
          <div>
          <p>
            These people have the same tags in <b>#Music</b> and <b>#Finland</b>.
          </p>
          {this.state.people.map((person, index)=>{
            return <Person key={index} name={person.name} chips={person.chips} image={person.image} joinVisible={this.joinVisible}/>
          })}
          <p>
            Choose and <a onTouchTap={()=>{this.setState({hasJoined: true})}}>join group</a> discussion with your classmates!
          </p>
          </div>
        );
      case 2:
        return (
          <p>
            Having fun and at the same time learn from your classmates
          </p>
        );
      default:
        return 'You\'re a long way from home sonny jim!';
    }
  }

  renderContent() {
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px', overflow: 'hidden'};

    if (finished) {
      return (
        <div style={contentStyle}>
          <p>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                this.setState({stepIndex: 0, finished: false});
              }}
            >
              Reset
            </a> to find more suitable group.
          </p>
        </div>
      );
    }

    return (
      <div style={contentStyle}>
        <div>{this.getStepContent(stepIndex)}</div>
        <div style={{marginTop: 24, marginBottom: 12}}>
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            onTouchTap={this.handlePrev}
            style={{marginRight: 12}}
          />
          <RaisedButton
            label={stepIndex === 1 ? 'Finish' : 'Next'}
            primary={true}
            onTouchTap={this.handleNext}
          />
        </div>
      </div>
    );
  }

  render() {
    const {loading, stepIndex} = this.state;
    var JoinGroup;
    if(this.state.joinGroup){
      JoinGroup = <RaisedButton label={"Join group"} primary={true}/>;
    }
    var GroupChat;
    if(!this.state.hasJoined){
    } else {
      GroupChat = 
      <div className="wrapper">
        <nav id="nav" className="nav">
          <div className="default-nav">
            <div className="main-nav">
              <div className="toggle"></div>
              <span style={{margin: 'auto 0'}}>Minh, Hoang, Kaisa</span>
              <IconButton style={{ margin: '10px 0px 10px 50px'}} iconStyle={{color: 'white'}}>
                <Phone/>
              </IconButton>
            </div>
          </div>
        </nav>
        <div id="inner" className="inner">
          <div id="content" className="content"><div className="message-wrapper me">
                    <Avatar style={{float:'right'}} src="frontend/img/minh.jpg"/>
                    <div className="text-wrapper animated fadeIn">Hello everyone, my name is Minh Cao. I am from Vietnam, I love modern arts and milk is my favorite drink.</div>
                  </div></div>
        </div>
        <div id="bottom" className="bottom">
          <textarea id="input" className="input"></textarea>
          <div id="send" className="send"></div>
        </div>
      </div>;
    }

    return (
      <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
        <h2 style={{margin: '0 auto'}}>Warmup activity</h2>
        <h3>Find your classmates based on interests to increase collaboration in class!</h3>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Write your interests</StepLabel>
          </Step>
          <Step>
            <StepLabel>Find classmates that match you</StepLabel>
          </Step>
        </Stepper>
        <ExpandTransition loading={loading} open={true}>
          {this.renderContent()}
        </ExpandTransition>
        {GroupChat}
      </div>
    );
  }
}

export default WarmupStepper;