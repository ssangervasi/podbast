import { Provider as ReduxProvider } from "react-redux";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { PersistGate } from "redux-persist/es/integration/react";

import { Home } from "/src/features/home";
// import { Common } from "/src/features/common/component";
import { persistor, store } from "/src/store/store";
import { theme } from "/src/ui/theme";

export const App = () => (
  <>
    {/* https://chakra-ui.com/docs/styled-system/color-mode */}
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    {/*  */}
    <ChakraProvider theme={theme}>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Home />
        </PersistGate>
      </ReduxProvider>
    </ChakraProvider>
  </>
);
