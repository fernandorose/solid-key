import { Route, Switch } from 'wouter';
import Home from './pages/Home';
import { Auth } from './pages/Auth/Auth';

const App = () => {
  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/auth" component={Auth} />
      </Switch>
    </>
  );
};

export default App;
