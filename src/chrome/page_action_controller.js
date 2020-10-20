import { Group } from './models.js'

class PageActionController
{
    constructor( port )
    {
        this.port = port
        this.state =
        {
            tabId: -1,
            groups: []
        }
        this.listeners = []
        this.dataLoaded = false
        this.dataLoadedPromise = new Promise(( resolve ) =>
        {
            port.onMessage.addListener(( _message ) =>
            {    
                console.info('PA: PAC: port.onMessage ', _message)
                if( _message.onConnectEvent )
                {
                    const message = _message.onConnectEvent
                    const groups = message.currentTabData.groups.map(Group.fromObject)

                    this.updateState({tabId: message.tabId, groups})
                    
                    this.dataLoaded = true
                    resolve()
                }
            })
        })

    }

    updateState( state )
    {
        console.info('PA: PAC: updateState', {state})

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