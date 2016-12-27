# Alexa greeting skill

It greets a guest and asks a rhetorical question. It uses the german language.

- cd src
- npm install
- npm run build

The 2nd step downloads the Alexa sdk. The 3rd step builds the file /tmp/alexa.zip suitable for uploading to AWS lambda.
The skills invocation name should be 'meinen gast'. Please use the files in directory speechAssets for setting up the skill.

Talk to the echo device for invoking the skill: 'Alexa, bitte begrüße meinen Gast.'

There are 2 more npm scripts:

- npm run deploy: runs the build and uploads the file to AWS lambda
- npm test: runs mocha tests
