import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './App.css';
import Root from "./routes/root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
]);

function App() {
  return (<RouterProvider router={router} />);
}

export default App;
