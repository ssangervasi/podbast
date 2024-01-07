import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";

import { Home } from "/src/features/home";
// import { Common } from "/src/features/common/component";
import { persistor, store } from "/src/store/store";

import "./app.css";

export const App = () => (
  <ReduxProvider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Home />
    </PersistGate>
  </ReduxProvider>
);
