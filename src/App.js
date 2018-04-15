import React, {Component} from 'react';
import Root from './components/Root'
import {Provider} from 'react-redux'
import store from './redux'
import {MuiThemeProvider} from 'material-ui/styles'
import './App.css'

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <MuiThemeProvider>
                    <Root/>
                </MuiThemeProvider>
            </Provider>
        );
    }
}

export default App;
