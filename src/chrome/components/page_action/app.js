import {LitElement, html} from 'lit-element'
import './select_identities_page.js'

class App extends LitElement
{
    constructor( )
    {
        super()

        this.addEventListener('app.openInIdentity', ( e ) => this.controller.openInIdentity(e.detail.identityId))
        
        this._onStateUpdate = this._onStateUpdate.bind(this)
    }

    connectedCallback( )
    {
        super.connectedCallback()

        this.controller.addStateUpdateListener(this._onStateUpdate)
    }

    disconnectedCallback( )
    {
        super.disconnectedCallback()

        this.controller.removeStateUpdateListener(this._onStateUpdate)
    }

    _onStateUpdate( state )
    {
        // console.log('App._onStateUpdate ', {state})
        this.state = state
    }

    static get properties( )
    {
        return {
            state: {type: Object},
            controller: {type: Object}
        }
    }

    render( )
    {
        return html`
            <select-identities-page .groups="${this.state.groups}"></select-identities-page>
        `
    }
}

customElements.define('app-el', App)