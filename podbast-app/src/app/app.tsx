import { Provider as ReduxProvider } from "react-redux";

import { Home } from "/src/features/home";
import { Common } from "/src/features/common/component";
import { store } from "/src/store/store";

import "./app.css";

export const App = () => (
  <ReduxProvider store={store}>
    <Common>
      <Home />
    </Common>
  </ReduxProvider>
);
