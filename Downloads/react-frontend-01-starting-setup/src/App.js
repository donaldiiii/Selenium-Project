import React from "react";
import { Redirect } from "react-router-dom";
import { Switch } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import AuthContext from "./auth-context";
import Auth from "./places/pages/Auth";
import NewPlace from "./places/pages/NewPlace";
import UpdatePlace from "./places/pages/UpdatePlace";
import UserPlaces from "./places/pages/UserPlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Users from "./user/pages/Users";
import { useAuth } from "./shared/hooks/auth-hook";

const App = () => {
 
  const {token, login, logout, userId} = useAuth();
  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact={true}>
          <Users></Users>
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId" exact>
          <UpdatePlace></UpdatePlace>
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces></UserPlaces>
        </Route>
        <Redirect to="/"></Redirect>
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users></Users>
        </Route>
        {/* always behind of /new because it will never reach if it was before */}
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Redirect to="/auth"></Redirect>
      </Switch>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
