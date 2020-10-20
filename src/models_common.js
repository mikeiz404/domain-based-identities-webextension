export class GroupCommon
{
    isMatch( url )
    {
        return this.patterns.reduce((found, pattern) => found || pattern.isMatch(url), false)
    }
}

export class PatternCommon
{
    isMatch( url )
    {
        // todo: support pattern types
        const hostname = (new URL(url)).hostname
        return this.value === hostname
    }
}

PatternCommon.TYPE_DOMAIN = "domain"
PatternCommon.TYPE_SUBDOMAIN = "subdomain"