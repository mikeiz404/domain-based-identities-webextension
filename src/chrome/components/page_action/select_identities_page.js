import {LitElement, html, css} from 'lit-element'
import {classMap} from 'lit-html/directives/class-map'
import {styleMap} from 'lit-html/directives/style-map'
import './identity.js'
import './identity_group.js'

class SelectIdentitiesPage extends LitElement
{
    static get styles( )
    {
        return css`
            :host
            {
                display: flex;
                flex-direction: column;
                height: 100%;
            }

            .header
            {
                display: flex;

                padding: 10px 10px 3px 10px;
                font-style: italic;
                color: #b3b3b3;
            }

            .header #title
            {
                flex-grow: 1;
            }

            .header #configure
            {
                height: 16px;
            }

            .groups
            {
                flex-grow: 1;
            }

            .footer .action
            {
                display: flex;
                margin-top: 1px;
                padding: 8px 5px;

                border-top: 2px solid #f4f4f4;
                background-color: #f9f9f9;
            }

            .footer .action .name
            {
                flex-grow: 1;
            }

            .footer .action .arrow
            {
                height: 16px;
            }

            .footer .action:hover
            {
                background-color: #2a2a2a;
                color: #fff;
            }
        `
    }

    static get properties( )
    {
        return {
            groups: {type: Array}
        }
    }

    openInIdentity( e )
    {
        const container = e.detail.container
        
        // open new tab
        browser.tabs.create({
            url: currentTab.url,
            index: currentTab.index + 1,
            pinned: currentTab.pinned,
            cookieStoreId: container.cookieStoreId
        })
    }

    render( )
    {
        return html`
            <div class="header">
                <div id="title">Open page in...</div>
                <img id="configure" src="icons/settings.svg"></img>
            </div>

            <div class="groups" @open-in-container=${this.openInIdentity}>
                ${this.groups.map(( g ) => html`<identity-group .value=${g}></container-group>`)}
            </div>

            <div class="footer">
                <div class="action">
                    <div class="name">Add Container</div>
                    <div class="arrow">></img>
                </div>
            </div>
        `
    }
}

customElements.define('select-identities-page', SelectIdentitiesPage)