# Lost Treasures Found

## Roadmap
- [ ] SEO
- [ ] Style ./signup.html
- [ ] Style for mobile
- [ ] Implement slideshow on thumbnails
- [x] Handle resize events for ./visualization.html
- [x] `postMessage` play / pause events for visualization based on visibility

## Steps
1. Get word list from `./word-occurrence.html`
  - Load the page and wait for the `<textarea />` to be populated
  - Take the contents of the `<textarea />` and save to `./assetsword-translations.json`
2. Run `node translate.js` from the command-line to query the Google Translate API
3. Run `node transcode.js` from the command-line to map Latin to Emojis
