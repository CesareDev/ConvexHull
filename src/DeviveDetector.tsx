import { BrowserView, MobileView } from 'react-device-detect'
import ConvexHull from './ConvexHull'


const DeviceDetector = () => (
    <>
        <BrowserView><ConvexHull /></BrowserView>
        <MobileView>I am rendered on: Mobile</MobileView>    
    </>
);

export default DeviceDetector;