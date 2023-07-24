import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import DeviceDetector from './DeviveDetector'

function App() 
{
    return (
        <ChakraProvider 
                theme={extendTheme({config: {
                useSystemColorMode: true,
                initialColorMode: "dark", // 'dark' | 'light'
                disableTransitionOnChange: false }
        })}>
            <ColorModeScript initialColorMode={"dark"}/>
            <DeviceDetector />
        </ChakraProvider>
    )
}

export default App
