function reopenTabInIdentity( tab, url, identityId, replace )
{
    browser.tabs.create({
        url: url,
        index: tab.index + 1,
        pinned: tab.pinned,
        cookieStoreId: identityId
    })

    if( replace ) browser.tabs.remove(tab.id)
}

export {reopenTabInIdentity}