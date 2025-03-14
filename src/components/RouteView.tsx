import { ArrowDown } from 'lucide-react'
import React, { useEffect } from 'react'

type Props = {
    response: {
        "route": any[],
        "total_cost": number
    }
}

const RouteView = ({response}: Props) => {
    const [routes, setRoutes] = React.useState<any>()
    const [cost, setCost] = React.useState<any>()

    useEffect(() => {
        setRoutes(response.route)
        setCost(response.total_cost)
    }, [])
    return (
        <div className='flex flex-col h-[calc(100vh-6rem)] bg-white rounded-lg shadow-lg overflow-y-scroll p-4 gap-4 '>
            <p className='text-gray-500 p-2 px-4'>Recommended Route with cost of <span className='font-semibold text-black'>{cost}</span></p>
            {
                response.route.map((route: any, index: number) => (
                    <>
                    {
                        index === 0 && <div className='mx-auto text-gray-500 text-lg'>Start trip from</div>
                    }
                        <div key={index} className='flex flex-col items-center justify-center p-2 rounded-lg bg-gray-100'>
                            <p className='text-lg font-semibold my-2'>{route[1]}</p>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='flex flex-col'>
                                    <p className='text-sm text-gray-500 '>Cost</p>
                                    <p className='text-sm font-semibold'>{route[5]}</p>
                                </div>
                                <div className='flex flex-col'>
                                    <p className='text-sm text-gray-500 '>Last incident Date</p>
                                    <p className='text-sm font-semibold'>{route[2]}</p>
                                </div>
                                <div className='flex flex-col'>
                                    <p className='text-sm text-gray-500 '>Risk Level</p>
                                    <p className='text-sm font-semibold'>{route[3]}/4</p>
                                </div>
                                <div className='flex flex-col'>
                                    <p className='text-sm text-gray-500 '>Terrain difficulty </p>
                                    <p className='text-sm font-semibold'>{route[6]}/10</p>
                                </div>
                            </div>
                        </div>
                        {
                            index !== response.route.length - 1 && <div className='mx-auto flex gap-4 text-gray-500'>Contnue to<ArrowDown /></div>
                        }
                        {
                        index === response.route.length - 1 && <div className='mx-auto text-gray-500 text-lg'>End of trip</div>
                    }
                    </>
                ))
            }
        </div>
    )
}

export default RouteView


