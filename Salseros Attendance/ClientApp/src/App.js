import React from 'react';
/* import { Route } from 'react-router'; */
import SignInPage from './SignInPage';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// minified version is also included
// import 'react-toastify/dist/ReactToastify.min.css';

/* import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIgloo } from '@fortawesome/free-solid-svg-icons';
library.add(faIgloo); */

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
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnVisibilityChange
            draggable={false}
            pauseOnHover
            transition={Slide}
          />
        </div>
      );
    }
  }
  
  export default App;
