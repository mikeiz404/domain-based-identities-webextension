import { GroupCommon, PatternCommon } from "models_common.js"

export class Group extends GroupCommon
{
    static fromObject( obj )
    {
        const instance = new Group()

        instance.id = obj.id
        instance.name = obj.name
        instance.defaultIdentity = obj.defaultIdentity ? Identity.fromObject(obj.defaultIdentity) : null
        instance.identities = obj.identities.map(Identity.fromObject)
        instance.patterns = obj.patterns.map(Pattern.fromObject)

        return instance
    }
}

export class Identity
{
    static fromObject( obj )
    {
        const instance = new Identity()

        instance.id = obj.id
        instance.cookieStoreId = obj.cookieStoreId
        instance.order = obj.order
        instance.nameOverride = obj.nameOverride
        instance.name = obj.icon
        instance.iconUrl = obj.iconUrl
        instance.colorCode = obj.colorCode

        return instance
    }

    get displayName( )
    {
        return this.nameOverride || this.name
    }
}

export class Pattern extends PatternCommon
{
    static fromObject( obj )
    {
        const instance = new Pattern()

        instance.id = obj.id
        instance.type = obj.type
        instance.value = obj.value

        return instance
    }
}