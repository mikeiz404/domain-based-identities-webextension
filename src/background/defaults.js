import {Group, Identity, Pattern} from './models.js'

export const GROUPS_DEFAULT = (() =>
{
    const identityA = new Identity('firefox-container-1', 'Personal')
    const identityB = new Identity('firefox-container-2', 'Work')

    const patternA = new Pattern(Pattern.TYPE_DOMAIN, 'www.google.com')
    
    const group = new Group('google.com')
    group.identities = [identityA, identityB]
    group.defaultIdentity = identityA
    group.patterns = [patternA]

    return [group]
})()

export const DOUBLECLICK_DURATION_DEFAULT = 300