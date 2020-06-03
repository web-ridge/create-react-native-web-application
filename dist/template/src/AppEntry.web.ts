import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from '../app.json';
import './AppEntry.css';

AppRegistry.registerComponent(appName, () => App);

AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root'),
});
