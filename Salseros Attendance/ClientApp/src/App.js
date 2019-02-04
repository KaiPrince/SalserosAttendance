import React from 'react';
/* import { Route } from 'react-router'; */
import SignInPage from './SignInPage';

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
