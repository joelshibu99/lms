import { useRoutes } from 'react-router-dom';
import routes from './app/routes';

function App() {
  const routing = useRoutes(routes);
  return routing;
}

export default App;
