# Contentful Code Snippets
## Entry Editor Extension for the Contentful CMS


### Contentful Improvements / Questions

*Extension CLI*
- Prompt that space is created before starting (maybe confirm first, or auto create a space?)

*Backend*
- When custom editor selected, it would be great to add fields automatically. It's Hard to remember to add each field and which one the instance variables override
- A faster way to delete many content types would be helpful in testing similar to the content functionality (select all and group actions)

## TO RUN

git clone this repo then cd into the holder
```
cd styled-code-snippets
```
install dependencies
```
npm i
```
fire up the dev server
```
npm run start
```

## DEVELOPMENT

- If highlight.js builds more styles into their framework, run the following from the project root to extract:
```
    node src/generateStyles
```
This will generate and highlightStyles.js in /src containing all highlight.js coding themes in an array exported by default

## FURTHER DEVELOPMENT / NOTES

- design to fit into coding course type
- Auto calculate language use percentage in lesson from code snippet type⋅⋅
- maybe option to create codepen / gist
- maybe option to link codepen / gist
