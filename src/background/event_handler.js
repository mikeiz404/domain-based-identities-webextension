export default class EventHandler
{
    constructor( )
    {
        this.listeners = new Set()
    }

    addListener( callback )
    {
        this.listeners.add(callback)
    }

    removeListener( callback )
    {
        this.listeners.delete(callback)
    }

    dispatch( ...parms )
    {
        this.listeners.forEach( listener => listener(...parms))
    }
}