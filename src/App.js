import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import FinalNavigation from './containers/navigation/navigationContainer.js';
import FinalBody from './containers/body/bodyContainer.js';
import Checkout from './components/checkout/checkout.js';

class App extends Component {

  render() {
    document.addEventListener(
      'keyup',
      (e) => {
        if (e.ctrlKey) {
          switch (e.code) {
            case 'KeyJ':
              window.pendo.showGuideById('A4Z_u7D0GnW27J7oCwtG0Ptekfk');
              break;
            case 'KeyK':
              window.pendo.designerv2.launchInAppDesigner();
              break;
            case 'KeyJL':
              window.pendo.showGuideById('kp8lRQSArHUW79IzqloeIBatViI');
              break;
          }
        }
      },
      false
    );

    return (
      <div className="App">
        <Switch>
          <Route exact path="/checkout" component={Checkout} />
          <Route
            render={() => (
              <React.Fragment>
                <FinalNavigation />
                <FinalBody visInfo="" />
              </React.Fragment>
            )}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
