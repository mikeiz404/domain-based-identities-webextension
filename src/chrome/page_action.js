import './components/page_action/app.js'
import {render, html} from 'lit-html'
import PageActionController from './page_action_controller.js'
import {IDENTITY_HEIGHT_ESTIMATE_PX, HEADER_HEIGHT_PX, FOOTER_HEIGHT_PX} from 'constants.js'

function estimatePageHeight( groups )
{
    const identitiesHeight = groups.reduce(( sum, group ) => sum + (group.identities.length * IDENTITY_HEIGHT_ESTIMATE_PX), 0)
    const pageHeight = HEADER_HEIGHT_PX + FOOTER_HEIGHT_PX + identitiesHeight

    return pageHeight
}

async function init( )
{
    // Connect to background script ASAP
    // note: this inits double click handling and implicitly request tab data
    const port = browser.runtime.connect()

    const controller = new PageActionController(port)
    
    document.addEventListener('DOMContentLoaded', async ( event ) => 
    {
        await controller.dataLoadedPromise

        // Estimate a >= minimum height for the body
        // note: Setting a body height improves time to content visibility by allowing the window to be sized
        // before the page is fully rendered.
        document.body.style.height = estimatePageHeight(controller.state.groups) + "px"

        render(html`<app-el .controller=${controller} .state=${controller.state}></app-el>`, document.body)
    })
    
}

init()