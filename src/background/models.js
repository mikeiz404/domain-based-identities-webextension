import { GroupCommon, PatternCommon } from "models_common.js"

export const version = 'v0.1'

export class DataRoot
{
    constructor( groups )
    {
        this.version = version
        this.groups = groups
    }

    static fromObject( obj )
    {
        const instance = new DataRoot()
        instance.version = obj.version
        instance.groups = obj.groups.map(Group.fromObject)

        return instance
    }
}

export class Group extends GroupCommon
{
    constructor( name )
    {
        super()

        this.id = Group.counter++
        this.name = name
        this.defaultIdentity = null
        this.identities = []
        this.patterns = []
    }

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

Group.counter = 0


export class Identity
{
    constructor( cookieStoreId, nameOverride = null )
    {        
        this.id = Identity.counter++
        this.cookieStoreId = cookieStoreId
        this.nameOverride = nameOverride
    }

    static fromObject( obj )
    {
        const instance = new Identity()

        instance.id = obj.id
        instance.cookieStoreId = obj.cookieStoreId
        instance.order = obj.order
        instance.nameOverride = obj.nameOverride

        return instance
    }

    get contextualIdentity( )
    {
        return Identity.identityMap.get(this.cookieStoreId)
    }
}

Identity.counter = 0
Identity.identityMap = null


export class Pattern extends PatternCommon
{
    constructor( type, value )
    {
        super()

        this.id = Pattern.counter++
        this.type = type
        this.value = value
    }

    static fromObject( obj )
    {
        const instance = new Pattern()
        instance.id = obj.id
        instance.type = obj.type
        instance.value = obj.value

        return instance
    }
}

Pattern.counter = 0