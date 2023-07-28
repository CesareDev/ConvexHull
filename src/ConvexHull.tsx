import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { BsGithub, BsFillInfoCircleFill } from 'react-icons/bs'
import { 
    Box,
    VStack,
    Grid,
    GridItem,
    Heading,
    Text, 
    Button, 
    Icon, 
    Link, 
    ScaleFade, 
    useColorMode,
    NumberInput, 
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react'
import { useState, useRef } from 'react'
import LineTo from 'react-lineto'

class Point 
{
    x: number;
    y: number;
    index: number;
    color?: string;

    constructor(x: number, y: number)
    {
        this.x = x;
        this.y = y;
        this.index = -1;
    }
}

class Line 
{
    fromIndex: number;
    toIndex: number;
    color: string;

    constructor(fromIndex: number, toIndex: number)
    {
        this.fromIndex = fromIndex;
        this.toIndex = toIndex;
        this.color = "red";
    }
}

const canvasWidth = 640;
const canvasHeigth = 640;
const radius = 6;

function ConvexHull()
{
    const {colorMode, toggleColorMode} = useColorMode();
    
    const points = useRef(Array<Point>());
    const lines = useRef(Array<Line>());
    const started = useRef(false);
    const pointsNumber = useRef(15);
    const delayTime = useRef(100);

    function getMousePosRelativeY(my: number)
    {
        let c = document.getElementById("canvas")?.getBoundingClientRect();
        if (c !== undefined)
        {
            return my - c.top;
        }
        return 0;
    }

    function getMousePosRelativeX(mx: number)
    {
        let c = document.getElementById("canvas")?.getBoundingClientRect();
        if (c !== undefined)
        {
            return mx - c.left;
        }
        return 0;
    }

    function canPlace(p: Point)
    {
        for (let i = 0; i < points.current.length; ++i)
        {
            if (distance(p, points.current[i]) < radius * 2)
                return false;
        }
        if (p.x < radius)
            p.x = radius;
        if (p.x > canvasWidth - radius)
            p.x = canvasWidth - radius;
        if (p.y < radius)
            p.y = radius;
        if (p.y > canvasHeigth - radius)
            p.y = canvasHeigth - radius;
        return true;
    }

    function randomPoint() 
    {
        points.current = [];
        lines.current = [];
        for (let i = 0; i < pointsNumber.current; ++i)
        {
            let x = Math.floor(Math.random() * (canvasWidth - 40)) + 20;
            let y = Math.floor(Math.random() * (canvasHeigth - 40)) + 20;
            let p1 = new Point(x, y);
            for (let p2 of points.current)
            {
                if (p1 !== p2)
                {
                    while (distance(p1, p2) < radius * 2)
                    {
                        p1.x = Math.floor(Math.random() * (canvasWidth - 40)) + 20;
                        p1.y = Math.floor(Math.random() * (canvasHeigth - 40)) + 20;
                    }
                }
            }
            points.current.push(p1);
        }
        sort();
        update();
    }

    function sort()
    {
        function compare(a: Point, b:Point)
        {
            if (a.x < b.x)
                return -1;
            else if (a.x === b.x)
            {
                if (a.y < b.y)
                    return -1;
                return 1;
            }
            return 1;
        }
        points.current.sort(compare);
        for (let i = 0; i < points.current.length; ++i)
        {
            points.current[i].index = i;
            points.current[i].color = colorMode === "dark" ? "white" : "black";
        }
    }

    function distance(p1: Point, p2: Point)
    {
        return Math.sqrt((p2.y - p1.y) * (p2.y - p1.y) + (p2.x - p1.x) * (p2.x - p1.x));
    }

    function forceUdpate()
    {
        const [value, setValue] = useState(0);
        value;
        return () => setValue(value => value + 1);
    }

    const update = forceUdpate();

    function delay(ms: number) 
    {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
 
    async function convexh()
    {
        if (points.current.length === 0)
            return;

        sort();
        const tmpDelay = delayTime.current; //prevent changing animation speed while running
        started.current = true;
        lines.current = [];

        var arr = points.current;
        var hull: Point[] = [];
        let indexMax = 0;

        hull.push(arr[indexMax]);
        points.current[arr[indexMax].index].color = "red";
        update();
        let max = Number.MIN_SAFE_INTEGER;

        var anim_line = new Line(indexMax, indexMax);

        for (let k = 1; k < arr.length; ++k)
        {
            if (hull[hull.length - 1].x === arr[k].x)
            {
                indexMax = k;

                anim_line.toIndex = indexMax;
                lines.current.push(anim_line);
                if (tmpDelay !== 0)
                    await delay(tmpDelay);
                update();
                lines.current.pop();

                break;
            }
            else
            {
                let m = (arr[k].y - hull[hull.length - 1].y) / (arr[k].x - hull[hull.length - 1].x);
                if (m > max)
                {
                    max = m;
                    indexMax = k;

                    anim_line.toIndex = indexMax;
                    lines.current.push(anim_line);
                    if (tmpDelay !== 0)
                        await delay(tmpDelay);
                    update();
                    lines.current.pop();
                }
            }    
        }
        hull.push(arr[indexMax]);
        points.current[arr[indexMax].index].color = "red";
        var l = new Line(anim_line.fromIndex, anim_line.toIndex);
        l.color = "green";
        lines.current.push(l);
        update();

        anim_line.fromIndex = indexMax;

        //up
        while (indexMax < arr.length - 1)
        {
            let max = Number.MIN_SAFE_INTEGER;
            for (let k = indexMax + 1; k < arr.length; ++k)
            {
                if (hull[hull.length - 1].x === arr[k].x)
                {
                    indexMax = k;

                    anim_line.toIndex = indexMax;
                    lines.current.push(anim_line);
                    if (tmpDelay !== 0)
                        await delay(tmpDelay);
                    update();
                    lines.current.pop();

                    break;
                }
                else
                {
                    let m = (arr[k].y - hull[hull.length - 1].y) / (arr[k].x - hull[hull.length - 1].x);
                    if (m > max)
                    {
                        max = m;
                        indexMax = k;

                        anim_line.toIndex = indexMax;
                        lines.current.push(anim_line);
                        if (tmpDelay !== 0)
                            await delay(tmpDelay);
                        update();
                        lines.current.pop();
                    }
                }    
            }
            hull.push(arr[indexMax]);
            points.current[arr[indexMax].index].color = "red";
            var l = new Line(anim_line.fromIndex, anim_line.toIndex);
            l.color = "green";
            lines.current.push(l);
            update();
            anim_line.fromIndex = indexMax;
        }

        //down
        while (indexMax > 0)
        {
            let max = Number.MIN_SAFE_INTEGER;
            for (let k = indexMax - 1; k >= 0; --k)
            {
                if (hull[hull.length - 1].x === arr[k].x)
                {
                    indexMax = k;

                    anim_line.toIndex = indexMax;
                    lines.current.push(anim_line);
                    if (tmpDelay !== 0)
                        await delay(tmpDelay);
                    update();
                    lines.current.pop();

                    break;
                }
                else
                {
                    let m = (arr[k].y - hull[hull.length - 1].y) / (arr[k].x - hull[hull.length - 1].x);
                    if (m > max)
                    {
                        max = m;
                        indexMax = k;

                        anim_line.toIndex = indexMax;
                        lines.current.push(anim_line);
                        if (tmpDelay !== 0)
                            await delay(tmpDelay);
                        update();
                        lines.current.pop();
                    }
                }    
            }
            hull.push(arr[indexMax]);
            points.current[arr[indexMax].index].color = "red";
            var l = new Line(anim_line.fromIndex, anim_line.toIndex);
            l.color = "green";
            lines.current.push(l);
            update();
            anim_line.fromIndex = indexMax;
        }

        started.current = false;
    }

    return (
        <>
            <Grid 
                templateAreas={`"header header link"
                                "nav main link"
                                "nav main link"`}>
                <GridItem area={"header"} padding={"15px"}>
                    <Heading size="3xl" noOfLines={1}>
                        Convex Hull Visualization
                        <Link title='Wikipedia' href='https://en.wikipedia.org/wiki/Convex_hull' isExternal>
                            <Icon as={BsFillInfoCircleFill} boxSize={6} marginLeft={"10px"}/>
                        </Link>
                    </Heading>
                </GridItem>
                <GridItem area={"link"} justifySelf={"end"} padding={"15px"}>
                    <VStack>
                        <Button onClick={() => {
                            toggleColorMode();
                        }}>
                            {colorMode === "dark" ? <SunIcon marginRight={"10px"}/> : <MoonIcon marginRight={"10px"}/>}
                            {colorMode === "dark" ? "Light Theme" : "Dark Theme"}
                        </Button>
                        <Link href='https://github.com/CesareDev?tab=repositories' isExternal marginTop={"15px"}>
                            <Button variant={"link"} colorScheme='grey'>
                                GitHub
                                <Icon as={BsGithub} boxSize={6} marginLeft={"10px"}/>
                            </Button>
                        </Link>
                    </VStack>
                </GridItem>
                <GridItem area={"nav"} padding={"15px"}>
                    <Box>
                        <Text fontSize={"2xl"}>
                            Number of points
                        </Text>
                    </Box>
                    <NumberInput marginTop={"15px"} width={"25%"} defaultValue={15} min={5} max={20} onChange={(string) => {
                            pointsNumber.current = parseInt(string);
                            points.current.forEach( (p) => {p.color = colorMode === "dark" ? "white" : "black"});
                        }}>
                        <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                    </NumberInput>
                    <Box marginTop={"15px"}>
                        <Text fontSize={"2xl"}>
                            Animation delay
                        </Text>
                    </Box>
                    <NumberInput marginTop={"15px"} width={"25%"} defaultValue={100} min={0} max={1000} onChange={(string) => {
                            delayTime.current = parseInt(string);
                            points.current.forEach( (p) => {p.color = colorMode === "dark" ? "white" : "black"});
                        }}>
                        <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                    </NumberInput>
                    <Box marginTop={"45px"}>
                        <Button variant={"outline"} isLoading={started.current} loadingText={"Wait"} onClick={convexh} >Start</Button>
                    </Box>
                    <ScaleFade in={!started.current} unmountOnExit>
                        <Button variant={"outline"} marginTop={"15px"} onClick={randomPoint}>Random</Button>
                    </ScaleFade>
                    <Box marginTop={"15px"}>
                        <Button variant={"outline"} onClick={() => {
                            started.current = false;
                            points.current = [];
                            lines.current = [];
                            update();
                        }}>Clear</Button>
                    </Box>
                </GridItem>
                <GridItem area={"main"} padding={"15px"} placeSelf={"center"}>
                    <Box 
                        id='canvas' 
                        className='canvas' 
                        position={"relative"} 
                        border={"solid 2px"} 
                        width={canvasWidth + "px"} 
                        height={canvasHeigth + "px"} 
                        maxW={canvasWidth + "px"} 
                        maxH={canvasHeigth + "px"}
                        onClick={(e) => {
                            if (started.current)
                                return;
                            points.current.forEach( (p) => {p.color = colorMode === "dark" ? "white" : "black"});
                            lines.current = [];
                            let p = new Point(getMousePosRelativeX(e.clientX), canvasHeigth - getMousePosRelativeY(e.clientY));
                            if (canPlace(p))
                            {
                                points.current.push(p);
                                sort();
                                update();
                            }
                        }}>
                        {points.current.map((point, index) => (
                            <Box 
                                className={"node" + index}
                                key={index} 
                                backgroundColor={point.color !== "red" ? colorMode === "dark" ? "white" : "black" : point.color} 
                                width={(radius * 2) + "px"}
                                height={(radius * 2) + "px"}
                                borderRadius={radius + "px"}
                                position={"absolute"}
                                left={(point.x - radius) + "px"}
                                bottom={(point.y - radius) + "px"}
                            ></Box>
                        ))}
                        {lines.current.map((line, index) => (
                            <LineTo key={index} zIndex={-1} within="canvas" from={"node" + line.fromIndex} to={"node" + line.toIndex} borderWidth={2} borderColor={line.color}></LineTo>
                        ))}
                    </Box>
                </GridItem>
            </Grid>
        </>
    );
}

export default ConvexHull;