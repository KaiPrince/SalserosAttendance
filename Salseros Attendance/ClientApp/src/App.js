import React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Counter from './components/Counter';
import FetchData from './components/FetchData';
import Attendance from './components/Attendance';
import Tutorial from './components/Tutorial';
import SignInPage from './SignInPage';
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button } from 'reactstrap';

/* export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/counter' component={Counter} />
        <Route path='/fetchdata/:startDateIndex?' component={FetchData} />
        <Route path='/attendance' component={Attendance} />
        <Route path='/test' component={Tutorial} />
    </Layout>
); */

class App extends React.Component {
    render() {
      return (
        <div className="App">
          <SignInPage />
        </div>
      );
    }
  }
  
  export default App;
