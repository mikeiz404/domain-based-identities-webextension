# To Do
- [ ] explore how to scale up page templates and multi page actions
- [ ] Auto create container and group when no container and group exists on double click

# 'Page Action' First Render Critical Path
## When Data Fetched from the 'Page Action'
1. (in parallel)
    - Load group data
    - Load contextual identities
    - Load current tab
2. Process group patterns against current tab URL
3. Render

## When Data Fetched from a 'Background Script'
1. Wait for message on socket connect
2. Render

# Observations
## Speed
- 30 - 60 (151ms)
- 15 - 20 ms
### Steps to Improve render time
- precompute data to reduce blocking calls (10-40ms)
- do not render Component until data is ready (? saves an extra render cycle)
- loading the script as synchronous (non type="module") will block the initial render and results in a quicker time to Component render (~10-20ms)

### Steps to improve spped perception
- use a fixed height so that style recalculations do not cause the window to resize (video capture and go frame by frame to see how other extensions which feel smooth and this one compare). Use min-height/width to allow for fixed size in most use cases. Had to switch from min-height to height to prevent a layout issue.

## Time Optimizations
- When running `browser.runtime.connect; Port.postMessage;` followed by `browser.runtime.sendMessage`, `sendMessage` beats `postMessage` by around `3ms to 20ms` on time to receive the first message.
    - There is fair amount of variance in the timing depending on conditions. Timing is closer to `1ms to 5ms` faster on page reloads or frequent new page loads. On infrequent page loads faster timings between `10ms and 20ms` are more common.
- It is faster to cache per tab identity data, needed by the UI, in the background script and message for it than it is to ask for it in pieces and proccess it each time on page load. There is a trade off of guaranteed reliability for speed: a race condition could occur where the active tab could change between the page action loading and the background script sending back the results. However this should be extremely unlikely since messaging had been observered to happen in under 50ms and time between user actions can be assumed to be at least an order of magnitude longer.
- `browser.contextualIdentities.get` takes on average `42ms` with a range of `30ms - 100ms` from a background script.
- `browser.storage.sync.get('groups')` with the small default data set being fetched takes on average `85ms` with a range of `70ms - 150ms` from a background script.
- `browser.tabs.query({active: true, currentWindow: true})` takes on average `65ms` with a range of `50ms - 130ms` from a background script.