const carCanvas = document.getElementById( 'carCanvas' )
carCanvas.height = window.innerHeight
carCanvas.width = 200
networkCanvas.height = window.innerHeight
networkCanvas.width = 300

const carCtx = carCanvas.getContext( '2d' )
const networkCtx = networkCanvas.getContext( '2d' )

const road = new Road( carCanvas.width / 2, carCanvas.width * 0.9, 3 )

const startLaneIndex = 1
const N = 100
const cars = generateCars( N )

const traffic = [
    new Car(
        road.getLaneCenter( startLaneIndex ),
        -100,
        30,
        50,
        'DUMMY',
        2
    )
]

animate( )

function generateCars( N )
{
    const cars = [ ]
    for( let i = 0; i < N; i ++ )
    {
        cars.push( new Car(
            road.getLaneCenter( startLaneIndex ),
            100,
            30,
            50,
            'AI' // 'KEYS'
        ) )
    }
    return cars
}

function animate( time )
{
    for( let i = 0; i < traffic.length; i ++ )
    {
        traffic[ i ].update( road.borders, [ ] )
    }
    
    for( let i = 0; i < cars.length; i ++ )
    {
        cars[ i ].update( road.borders, traffic )
    }

    const bestCar = cars.find( car =>
        car.y === Math.min( ... cars.map( c => c.y ) )
    )

    carCanvas.height = window.innerHeight
    networkCanvas.height = window.innerHeight

    carCtx.save( )
    carCtx.translate( 0, - bestCar.y + carCanvas.height * 0.7 )

    road.draw( carCtx )
    
    for( let i = 0; i <traffic.length; i ++ )
    {
        traffic[ i ].draw( carCtx, 'red' )
    }

    carCtx.globalAlpha = 0.2
    for( let i = 1; i < cars.length; i ++ )
    {
        cars[ i ].draw( carCtx, 'blue' )
    }
    carCtx.globalAlpha = 1

    bestCar.draw( carCtx, 'blue', true )

    carCtx.restore( )

    networkCtx.lineDashOffset = - time * 0.01
    Visualizer.drawNetwork( networkCtx, bestCar.brain )

    requestAnimationFrame( animate )
}