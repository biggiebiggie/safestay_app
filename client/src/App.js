import React, { Component } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter
} from "react-router-dom";

// Components
import HeaderMain from './components/header/HeaderMain';
import Home from "./pages/Home/Home";
import Search from "./pages/Search/Search";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Profile from "./pages/Profile/Profile";
import SingleView from "./pages/SingleView/SingleView";
import CreateProperty from "./pages/CreateProperty/CreateProperty";
import UpdateProperty from "./pages/UpdateProperty/UpdateProperty";
import UpdateCreditCard from "./pages/UpdateCreditCard/UpdateCreditCard";
import UpdateUser from "./pages/UpdateUser/UpdateUser";

class App extends Component {
  state = {
    searchQueries: {
      destination: "Copenhagen",
      checkIn: null,
      checkOut: null,
      guests: null
    },
    auth: {
      loggedIn: false,
      user: null
    }
  };

  componentDidMount() {
    this.authStatus();
  }

  authStatus = async () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }

    await fetch('http://localhost:8080/users/session', options)
      .then(res => res.json())
      .then(res => res.status === 1
        ? this.setState({
          auth: {
            loggedIn: true,
            user: res.user
          }
        })
        : this.setState({
          auth: {
            loggedIn: false,
            user: null
          }
        })
      )
      .catch(error => console.log(error))
  }

  onTravelChange = (destination, checkIn, checkOut, guests) => {
    this.setState({ searchQueries: { destination, checkIn, checkOut, guests } });
  };

  render() {
    const {
      authStatus,
      state: {
        auth
      }
    } = this
    return (
      <Router>
        <div className="App">
          {/* {this.props.location.pathname !== "/" && <HeaderMain handleTravelInfoChange={onTravelInfoChange} auth={auth} />} */}
          <Switch>
            <Route exact path="/" component={null} />
            <Route path="/" component={props => <HeaderMain {...props} auth={auth} handleTravelChanges={this.onTravelChange} updateAuth={authStatus} />} />
          </Switch>

          <Switch>
            <Route exact path="/" component={props => <Home {...props} auth={auth} handleTravelChanges={this.onTravelChange} updateAuth={authStatus} />} />
            <Route path="/search" component={props => <Search {...props} searchQueries={this.state.searchQueries} />} />
            <Route
              path="/create-property"
              component={props => <CreateProperty {...props} />}
            />
            <Route
              path="/update-property"
              component={props => <UpdateProperty {...props} />}
            />
            <Route
              path="/update-profile"
              component={props => <UpdateUser {...props} auth={auth} updateAuth={authStatus} />}
            />
            <Route
              path="/update-credit-card"
              component={props => <UpdateCreditCard {...props} auth={auth} updateAuth={authStatus} />}
            />
            <Route
              path="/property"
              component={props => <SingleView {...props} auth={auth} />}
            />
            <Route path="/login" component={props => <Login {...props} updateAuth={authStatus} />} />
            <Route path="/signup" component={props => <Signup {...props} updateAuth={authStatus} />} />
            <Route
              path="/profile"
              component={props => <Profile {...props} auth={auth} updateAuth={authStatus} />}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default withRouter(App);
