import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import ConvexHull from './ConvexHull'

function App() 
{
    return (
        <ChakraProvider theme={extendTheme({config: {
                useSystemColorMode: true,
                initialColorMode: "dark", // 'dark' | 'light'
                disableTransitionOnChange: false 
            }
        })}>
            <ColorModeScript initialColorMode={"dark"}/>
            <ConvexHull />
        </ChakraProvider>
    )
}

export default App
