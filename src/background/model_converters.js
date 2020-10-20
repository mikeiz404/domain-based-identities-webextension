import * as chrome from 'chrome/models.js'

export const BackgroundToChrome = {}

BackgroundToChrome.fromGroup = ( group ) =>
{
    const instance = new chrome.Group()

    instance.id = group.id
    instance.name = group.name
    instance.defaultIdentity = group.defaultIdentity ? BackgroundToChrome.fromIdentity(group.defaultIdentity) : null
    instance.identities = group.identities.map(BackgroundToChrome.fromIdentity)
    instance.patterns = group.patterns.map(BackgroundToChrome.fromPattern)

    return instance
}

BackgroundToChrome.fromIdentity = ( identity ) =>
{
    const instance = new chrome.Identity()

    instance.id = identity.id
    instance.cookieStoreId = identity.cookieStoreId
    instance.order = identity.order
    instance.nameOverride = identity.nameOverride
    instance.name = identity.contextualIdentity.icon
    instance.iconUrl = identity.contextualIdentity.iconUrl
    instance.colorCode = identity.contextualIdentity.colorCode

    return instance
}

BackgroundToChrome.fromPattern = ( pattern ) =>
{
    const instance = new chrome.Pattern()

    instance.id = pattern.id
    instance.type = pattern.type
    instance.value = pattern.value

    return instance
}