class PageActionController
{
    constructor( port )
    {
        this.port = port
        this.state =
        {
            groups: []
        }
        this.listeners = []
        this.dataLoaded = false
        this.dataLoadedPromise = new Promise(( resolve ) =>
        {
            port.onMessage.addListener(( _message ) =>
            {    
                if( _message.onConnectEvent )
                {   
                    const message = _message.onConnectEvent
                    const groups = message.currentTabData.groups
                    this.updateState({groups})
                    
                    this.dataLoaded = true
                    resolve()
                }
            })
        })

    }

    updateState( state )
    {
        // merge values
        this.state = {...this.state, ...state}

        this.listeners.forEach(( callback ) => callback(state))
    }

    addStateUpdateListener( callback )
    {
        this.listeners.push(callback)
        callback(this.state)
    }

    openInIdentity( identityId )
    {
        console.log('App: PageController.openInIdentity', {identityId})

        this.port.postMessage({
            openInIdentityEvent:
            {
                identityId
            }
        })
    }
}

export default PageActionController