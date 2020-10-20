import {TabDataService} from './tab_data_service.js'
import * as Actions from './actions.js'
import {GROUPS_DEFAULT, DOUBLECLICK_DURATION_DEFAULT} from './defaults.js'
import { BackgroundToChrome } from './model_converters.js'

async function init( )
{
    console.info('BK: Init')

    // todo: store Group.counter, Identity.counter, and Pattern.counter in DB

    const tds = new TabDataService()

    // setup page action icon updating
    tds.onTabUpdate.addListener(( tabId ) => updatePageActionIcon(tds, tabId))

    // setup double click handling
    addDoubleClickListener(async ( ) =>
    {
        const tabData = await tds.getCurrentTabData()

        const defaultIds = getDefaultIdentityIds(tabData.groups)
        if( defaultIds.length === 1 )
        {
            const currentTab = await tds.getCurrentTab()
            const identityId = defaultIds[0]

            Actions.reopenTabInIdentity(currentTab, tabData.committedUrl, identityId)
        }
        else if( defaultIds.length === 0 )
        {
            browser.notifications.create({
                type: 'basic',
                title: 'Cannot open in DEFAULT container',
                message: 'No container has been set as a default.',
            })
        }
        else // many defaults
        {
            browser.notifications.create({
                type: 'basic',
                title: 'Cannot open in DEFAULT container',
                message: 'More than one DEFAULT container is set.',
            })
        }

        console.info('BK: doubleClickHandler', {tabData, defaultIds})
    })

    // setup messaging
    browser.runtime.onConnect.addListener(async ( port ) =>
    {
        const tabData = await tds.getCurrentTabData()

        // send onConnectEvent
        port.postMessage(
            {
                onConnectEvent:
                {
                    currentTabData:
                    {
                        tabId: tabData.tabId,
                        groups: tabData.groups.map(BackgroundToChrome.fromGroup)
                    }
                }
            }
        )

        // handle requests
        port.onMessage.addListener(async ( _message ) =>
        {
            console.info('BK: browser.runtime.onMessage: ', _message)
            if( _message.tabMatchesReq )
            {
                const message = _message.tabMatchesReq
                const tabId = message.tabId

                browser.runtime.sendMessage({tabMatchesResp: {tabId, matches: tabMatches[tabId]}})
            }

            if( _message.openInIdentityEvent )
            {
                const message = _message.openInIdentityEvent

                if( message.useDefaultContainer )
                {
                    const containerIds = getDefaultIdentityIds(tabMatches[message.tabId])
                    if( containerIds.length == 1 )
                    {
                        const currentTab = await tds.getCurrentTab()
                        const identityId = identityIds[0]
            
                        Actions.reopenTabInIdentity(currentTab, tabData.committedUrl, identityId)
                    }
                    else if( containerIds.length == 0 )
                    {
                        browser.notifications.create({
                            type: 'basic',
                            title: 'Cannot open in DEFAULT container',
                            message: 'No container has been set as a default.',
                        })
                    }
                    else // containerIds.length > 1
                    {
                        browser.notifications.create({
                            type: 'basic',
                            title: 'Cannot open in DEFAULT container',
                            message: 'There is more than one default container.',
                        })
                    }
                }
                else // !message.useDefaultContainer
                {
                    const currentTab = await tds.getCurrentTab()

                    Actions.reopenTabInIdentity(currentTab, tabData.committedUrl, message.identityId)
                }
            }
        })
    })

    // set default data on install
    browser.runtime.onInstalled.addListener(async ( {reason} ) =>
    {
        console.info('BK: browser.runtime.onInstalled: ', {reason})

        if( reason === 'install')
        {
            console.log('BK: Clearing and loading default data.', {GROUPS_DEFAULT})
        
            await browser.storage.sync.clear()
            browser.storage.sync.set({groups: GROUPS_DEFAULT})
        }

    })
}

// set up double click handling
function addDoubleClickListener( callback )
{
    browser.runtime.onConnect.addListener(( port ) =>
    {
        const start = Date.now()

        port.onDisconnect.addListener(function ( port )
        {
            const end = Date.now()
            const duration = end - start

            if( duration < DOUBLECLICK_DURATION_DEFAULT ) callback()
            port.onDisconnect.removeListener(this)
        })
    })
}

function getDefaultIdentityIds( groups )
{
    const defaults = groups.map(( group ) =>
        group.defaultIdentityId).filter(( id ) =>
            id
        )
    return [...new Set(defaults)]
}

async function updatePageActionIcon( tds, tabId )
{
    const tabData = await tds.getTabData(tabId)

    const enabled =  tabData.groups.length > 0
    const icon = enabled ? 'icons/action-active.svg' : 'icons/action-inactive.svg'
    browser.pageAction.setIcon({tabId, path: {48: icon}})

    console.info('BK: updatePageActionIcon', {tabId, tabData, enabled})
}


init()