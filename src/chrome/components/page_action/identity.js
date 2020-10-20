import {LitElement, html, css, unsafeCSS} from 'lit-element'
import {styleMap} from 'lit-html/directives/style-map'

class Identity extends LitElement
{

    static get properties( )
    {
        return {
            value: {type: Object},
            isDefault: {type: Boolean},
            isActive: {type: Boolean}
        }
    }

    static get styles( )
    {
        return css`
            .container
            {
                display: flex;
                margin: 0px;
                height: 26px;
                padding: 10px;
                align-items: center;

                list-style: none;
            }

            .container .name
            {
                flex-grow: 1;
            }
            
            .container .isDefault
            {
                padding: 2px 8px;
                border-radius: 5px;

                text-align: center;
                font-size: 12px;
                color: #aaa;
                background-color: #f9f9f9;
            }

            .container .icon
            {
                width: 20px;
                height: 20px;
                margin-right: 7px;

                background-image: var(--container-icon);
                background-size: contain;
            }

            .container.active
            {
                color: var(--container-color);
            }

            /* filter and fill technique from https://github.com/mozilla/multi-account-containers/blob/master/src/css/popup.css */
            /*
            .container.active .icon
            {
                fill: var(--container-color);
                filter: url('/img/filters.svg#fill');
            } */

            .container:hover
            {
                background-color: #bbb;
            }

            .container:hover .isDefault
            {
                color: rgb(221, 221, 221);
                background-color: rgb(132, 132, 132);
            }
        `
    }

    openInIdentity( )
    {
        this.dispatchEvent(new CustomEvent('app.openInIdentity',
        {
            detail:
            {
                identityId: this.value.cookieStoreId
            },
            bubbles: true,
            composed: true
        }))
    }

    render( )
    {
        const classes = []
        if( this.isActive ) classes.push('active')
        this.setAttribute("class", classes.join(' '))

        const styles = {
            "--container-color": unsafeCSS(this.value.colorCode),
            "--container-icon": css`url(${unsafeCSS(this.value.iconUrl)})`
        }

        return html`
            <div class="container" @click=${this.openInIdentity} style=${styleMap(styles)}>
                <div class="icon"></div>
                <div class="name">${this.value.displayName}</div>
                ${this.isDefault ? html`<div class="isDefault">DEFAULT</div>` : html``}
            </div>
        `
    }
}

customElements.define('identity-el', Identity)