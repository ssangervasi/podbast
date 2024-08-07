import {
	ChakraTheme,
	extendTheme,
	StyleFunctionProps,
	theme as defaultTheme,
	defineStyleConfig,
} from '@chakra-ui/react'

import { mapValues } from '/src/utils'

const calc = (...cssVals: string[]) => `calc(${cssVals.join(' ')})`

const mapCalc = <Mob extends Record<string, unknown>>(
	mob: Mob,
	cssVal: string,
	cond?: (v: string) => boolean,
) =>
	mapValues(mob, v =>
		typeof v !== 'string' ? v : cond && !cond(v) ? v : calc(v, cssVal),
	)

export const theme = extendTheme({
	config: {
		initialColorMode: 'system',
		useSystemColorMode: true,
	},

	styles: {
		global: {
			'html, body': {
				fontSize: 'md',
			},
		},
	},

	colors: {
		gray: {
			'50': '#F4F1F4',
			'100': '#DFD7DF',
			'200': '#CBBECB',
			'300': '#B7A4B7',
			'400': '#A28AA2',
			'500': '#8E718E',
			'600': '#725A72',
			'700': '#554455',
			'800': '#392D39',
			'900': '#1C171C',
		},
		red: {
			'50': '#FBEAEA',
			'100': '#F3C5C3',
			'200': '#EC9F9D',
			'300': '#E47A77',
			'400': '#DC5550',
			'500': '#D52F2A',
			'600': '#AA2622',
			'700': '#801C19',
			'800': '#551311',
			'900': '#2B0908',
		},
		orange: {
			'50': '#FBF3E9',
			'100': '#F4DDC2',
			'200': '#EEC79B',
			'300': '#E7B274',
			'400': '#E09C4D',
			'500': '#D98626',
			'600': '#AE6B1E',
			'700': '#825017',
			'800': '#57360F',
			'900': '#2B1B08',
		},
		yellow: {
			'50': '#FCF5E8',
			'100': '#F8E3BF',
			'200': '#F3D296',
			'300': '#EEC06D',
			'400': '#E9AE44',
			'500': '#E49C1B',
			'600': '#B77D15',
			'700': '#895E10',
			'800': '#5B3F0B',
			'900': '#2E1F05',
		},
		green: {
			'50': '#ECF8F0',
			'100': '#CAEDD5',
			'200': '#A8E1BA',
			'300': '#86D59F',
			'400': '#64C985',
			'500': '#42BD6A',
			'600': '#359755',
			'700': '#27723F',
			'800': '#1A4C2A',
			'900': '#0D2615',
		},
		teal: {
			'50': '#ECF9F9',
			'100': '#C9EEED',
			'200': '#A6E3E1',
			'300': '#83D8D6',
			'400': '#60CCCA',
			'500': '#3EC1BF',
			'600': '#319B98',
			'700': '#257472',
			'800': '#194D4C',
			'900': '#0C2726',
		},
		cyan: {
			'50': '#E6FAFE',
			'100': '#B9F2FD',
			'200': '#8CEAFC',
			'300': '#5FE1FB',
			'400': '#32D9FA',
			'500': '#06D0F9',
			'600': '#04A7C8',
			'700': '#037D96',
			'800': '#025364',
			'900': '#012A32',
		},
		blue: {
			'50': '#EAF3FB',
			'100': '#C4DCF3',
			'200': '#9DC6EB',
			'300': '#77AFE4',
			'400': '#5199DC',
			'500': '#2B83D4',
			'600': '#2269AA',
			'700': '#1A4E7F',
			'800': '#113455',
			'900': '#091A2A',
		},
		purple: {
			'50': '#F2E9FB',
			'100': '#DBC2F5',
			'200': '#C39AEE',
			'300': '#AC73E8',
			'400': '#954BE2',
			'500': '#7E24DB',
			'600': '#641DAF',
			'700': '#4B1683',
			'800': '#320E58',
			'900': '#19072C',
		},
		pink: {
			'50': '#FCE8F3',
			'100': '#F7BFDC',
			'200': '#F297C6',
			'300': '#ED6EB0',
			'400': '#E84599',
			'500': '#E31C83',
			'600': '#B61669',
			'700': '#88114F',
			'800': '#5B0B34',
			'900': '#2D061A',
		},
	},

	semanticTokens: {
		// A way to give semantic names instead referencing "purple"
		// colors: {
		// 	snorp: 'purple.200',
		// 	sneep: 'purple.600',
		// 	'storf.100': 'purple.100',
		// },
	},

	/**
	 * So dirty
	 * https://github.com/chakra-ui/chakra-ui/blob/main/packages/theme/src/foundations/sizes.ts
	 */
	sizes: mapCalc(defaultTheme.sizes, '* 0.85', v => /rem/.test(v)),

	space: mapCalc(defaultTheme.space, '* 0.9'),

	fontSizes: mapCalc(defaultTheme.fontSizes, '* 0.85'),

	fonts: {
		body: 'system-ui, sans-serif',
		heading: 'monospace, system-ui, sans-serif',
	},

	components: {
		Link: {
			baseStyle: {
				color: 'blue.100',
			},
		},
		/**
		 * https://github.com/chakra-ui/chakra-ui/blob/main/packages/theme/src/components/button.ts#LL129
		 */
		Button: {
			baseStyle: {
				fontFamily: 'heading',
			},
			defaultProps: {
				variant: 'outline',
				colorScheme: 'purple',
			},
			variants: {
				outline: (_props: StyleFunctionProps) => ({
					borderBottomWidth: '2px',
				}),
				interactOnly: (_props: StyleFunctionProps) => ({
					borderBottomWidth: '2px',
					borderColor: 'transparent',
					_hover: {
						borderColor: 'purple.200',
					},
					_active: {
						borderColor: 'purple.400',
					},
				}),
			},
		},
		FormLabel: {
			defaultProps: {
				variant: 'vibe',
			},
			variants: {
				vibe: (_props: StyleFunctionProps) => ({
					fontWeight: '600',
					color: 'purple.100',
					// backgroundColor: 'hotpink',
				}),
			},
		},
		Heading: defineStyleConfig({
			baseStyle: props =>
				({
					h1: {
						fontSize: '3xl',
					},
					h2: {
						fontSize: '2xl',
					},
				})[props.as as string] ?? {
					fontSize: 'xl',
				},
			sizes: {
				byAs: {},
			},
			defaultProps: {
				size: 'byAs',
			},
		}),
	},
} satisfies Partial<ChakraTheme>) as ChakraTheme
