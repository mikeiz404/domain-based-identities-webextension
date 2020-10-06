import EventHandler from './event_handler.js'

function isMatch( group, url )
{
    const hostname = (new URL(url)).hostname
    return group.patterns.reduce((found, pattern) => found || hostname === pattern, false)
}

class TabDataService
{
    constructor( )
    {
        this.onTabUpdate = new EventHandler()
        this.currentTab = null
        this.identities = new Map()
        this.groups = []
        this.tabGroups = new Map() // tabId: group
        this.tabCommittedUrls = new Map()

        // load groups
        let groupsPromise = browser.storage.sync.get('groups').then(( data ) =>
        {
            console.info('BK: TDS: browser.storage.sync.get(\'groups\')', {data})
            this.groups = data.groups || []
        })

        // handle group updates
        // browser.storage.sync.onChanged.addListener(( changes ) =>
        // {
        //     Object.keys(changes).forEach(( key ) => {
        //         const group = changes[key]

        //         this.groups[change.]
        //     })
        // })

        // process current
        // ... identities
        let identitiesPromise = browser.contextualIdentities.query({})
        .then(( identities ) =>
            // note: this.identities will be empty when this is called so no need to clear it
            Object.keys(identities).forEach(( key ) =>
            {
                const identity = identities[key]
                this.identities.set(identity.cookieStoreId, identity)
            })
        )

        // ... active tab in current window
        let currentTabPromise = browser.tabs.query({currentWindow: true, active: true}).then(( [tab] ) => this.currentTab = tab)

        // ... tab urls
        let tabsPromise = browser.tabs.query({})
        this.initPromise = Promise.all([tabsPromise, currentTabPromise, groupsPromise, identitiesPromise]).then(async ( [tabs] ) =>
        {
            tabs.forEach(( tab ) => this._updateTab(tab.id, tab.url))
        })

        // watch
        // ... identity updates
        browser.contextualIdentities.onUpdated.addListener(( {contextualIdentity: identity} ) =>
        {
            console.info('BK: TDS: contextualIdentities.onUpdated', {identity})
            this.identities.set(identity.cookieStoreId, identity)
        })
        browser.contextualIdentities.onCreated.addListener(( {contextualIdentity: identity} ) =>
        {
            console.info('BK: TDS: contextualIdentities.onCreated', {identity})
            this.identities.set(identity.cookieStoreId, identity)
        })
        browser.contextualIdentities.onRemoved.addListener(( {contextualIdentity: identity} ) =>
        {
            console.info('BK: TDS: contextualIdentities.onRemoved', {identity})
            this.identities.delete(identity.cookieStoreId)
        })

        // ... last active tab in current window
        browser.tabs.onActivated.addListener(( {tabId} ) =>
        {
            console.info('BK: TDS: tabs.onActivated', {tabId})
            const currentTabPromise = browser.tabs.get(tabId)
            this.initPromise = this.initPromise.then(async ( ) => this.currentTab = (await currentTabPromise) || null)
        })
        browser.windows.onFocusChanged.addListener(async ( windowId ) =>
        {
            const currentTabPromise = browser.tabs.query({windowId, active: true})
            console.info('BK: TDS: windows.onFocusChanged', {windowId, tabId: (await currentTabPromise)[0].id})

            this.initPromise = this.initPromise.then(async ( ) => this.currentTab = (await currentTabPromise)[0] || null)
        })

        // ... tab url changes
        browser.webNavigation.onCommitted.addListener(( event ) =>
        {
            console.info('BK: TDS: webNavigation.onCommitted', {event, willUpdateTab: event.frameId === 0})

            event.frameId === 0 && this._updateTab(event.tabId, event.url)
        })

        // ... tab removal
        browser.tabs.onRemoved.addListener( ( tabId ) =>
        {
            console.info('BK: TDS: tabs.onRemoved', {tabId})

            delete this.tabGroups.delete(tabId)
            delete this.tabGroups.delete(tabId)
        })
    }

    _updateTab( tabId, url )
    {
        console.info('BK: TDS: _updateTab', {tabId, url})
        // this.tabGroups.set(tabId, this.groups.filter(( group ) => isMatch(group, url)))
        this.tabGroups.set(tabId, this.groups)
        this.tabCommittedUrls.set(tabId, url)

        this.onTabUpdate.dispatch(tabId, url)
    }

    async getTabData( tabId )
    {
        await this.initPromise
        return ({
            tabId: tabId,
            committedUrl: this.tabCommittedUrls.get(tabId),
            groups: this.tabGroups.get(tabId).map(( group ) =>
            ({
                ...group,
                identities: group.identityIds.map(( id ) => this.identities.get(id))
            }))
        })
    }

    async getCurrentTab( )
    {
        await this.initPromise
        return this.currentTab
    }

    async getCurrentTabData( )
    {
        await this.initPromise

        const currentTab = await this.getCurrentTab()
        return currentTab ? this.getTabData(currentTab.id) : null
    }
}

export {TabDataService}