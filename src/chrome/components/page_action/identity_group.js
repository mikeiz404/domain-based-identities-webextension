import {LitElement, html, css} from 'lit-element'

class IdentityGroup extends LitElement
{
    static get properties()
    {
        return {
            value: {type: Object}
        }
    }

    static get styles( )
    {
        return css`
            .group
            {
                margin-top: 10px;
            }

            .group .top
            {
                display: flex;
                padding: 8px 10px;

                color: #848484;
                background-color: #f9f9f9;
                border-top: 2px solid #f4f4f4;
            }

            .group .top .name
            {
                flex: 1;

                /* font-style: italic; */
            }

            .group .top .editAction
            {
                padding: 0 5px;
                
                width: 16px;
                height: 16px;

                background: url("icons/edit.svg") center / 16px 16px no-repeat no-repeat;
            }

            .containers
            {
                padding: 0;
                margin: 0;
            }
        `
    }

    render( )
    {
        return html`
            <div class="group">
                <div class="top">
                    <div class="name">${this.value.name}</div>
                    <div class="editAction"></div>
                </div>
                <ul class="containers">
                    ${this.value.identities.map(( identity ) => html`
                        <identity-el
                            .value=${identity}
                            .isDefault=${identity.cookieStoreId === this.value.defaultContextId}
                            .isActive=${false /*c.cookieStoreId === currentTab.cookieStoreId*/}>
                        </identity-el>`)}
                </ul>
            </div>
        `
    }
}

customElements.define('identity-group', IdentityGroup)