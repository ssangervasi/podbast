import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'

import { Common } from '/src/features/common'
import { Layout } from '/src/features/layout'
// import { Common } from "/src/features/common/component";
import { persistor, store } from '/src/store/store'
import { theme } from '/src/ui/theme'

export const App = () => (
	<>
		{/* https://chakra-ui.com/docs/styled-system/color-mode */}
		<ColorModeScript initialColorMode={theme.config.initialColorMode} />
		{/*  */}
		<ChakraProvider theme={theme}>
			<ReduxProvider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<Common />
					<Layout />
				</PersistGate>
			</ReduxProvider>
		</ChakraProvider>
	</>
)
