import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import { BrowserView, MobileView } from 'react-device-detect'
import ConvexHull from './ConvexHull'
import ConvexHullMobile from './ConvexHullMobile'

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
            <BrowserView>
                <ConvexHull />
            </BrowserView>
            <MobileView>
                <ConvexHullMobile />
            </MobileView>
        </ChakraProvider>
    )
}

export default App
