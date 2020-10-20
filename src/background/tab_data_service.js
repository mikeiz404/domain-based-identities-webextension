import EventHandler from './event_handler.js'
import {Group, Identity, Pattern} from './models.js'

class TabDataService
{
    constructor( )
    {
        this.onTabUpdate = new EventHandler()
        this.currentTab = null
        this.identities = new Map() // cookieStoreId: contextualIdentity
        this.groups = []
        this.tabGroups = new Map() // tabId: group
        this.tabCommittedUrls = new Map() // tabId: url

        // inject
        Identity.identityMap = this.identities

        // load groups
        let groupsPromise = browser.storage.sync.get('groups').then(( data ) =>
        {
            console.info('BK: TDS: browser.storage.sync.get(\'groups\')', {data})

            this.groups = (data.groups || []).map(Group.fromObject)
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
        this.initPromise = Promise.all([tabsPromise, groupsPromise, identitiesPromise, currentTabPromise]).then(async ( [tabs, groups] ) =>
        {
            tabs.forEach(( tab ) => this._updateTab(tab.id, tab.url))

            // todo: delete missing identities
            this.groups.map(Group.fromObject)
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

            // todo: remove references to this identity from all Groups
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
        // this.tabGroups.set(tabId, this.groups.filter(( group ) => group.isMatch(url)))
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
            groups: this.tabGroups.get(tabId)
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