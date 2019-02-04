# Lost Treasures Found

## Local Development
1. `npm install` adds all development dependencies
2. `npm run watch` runs a local server and live reloads LESS / HTML changes

## Roadmap
- [x] SEO
- [ ] Style ./signup.html
- [x] Style for mobile
- [x] Implement slideshow on thumbnails
- [x] Handle resize events for ./visualization.html
- [x] `postMessage` play / pause events for visualization based on visibility

## Steps
1. Get word list from `./word-occurrence.html`
  - Load the page and wait for the `<textarea />` to be populated
  - Take the contents of the `<textarea />` and save to `./assetsword-translations.json`
2. Run `node translate.js` from the command-line to query the Google Translate API
3. Run `node transcode.js` from the command-line to map Latin to Emojis
