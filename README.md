# SDA Church App

**UPDATE: State of GraphQL --** While the hype and the movements behind this technology is huge, it still seems to be a too fast a moving target, that things tend to change too often too fast. Because of this, documents quickly becomes irrelevant and outdated, which makes development according to any established best practice still not possible. I would like to re-explore this branch once the open-source projects behind this stabilizes and breaking changes happen less often. 

This is the GraphQL version of this project.

Firebase is a very cool platform, but its biggest drawback is the lack of data structure and constrains, and above everything else, **missing relationships**.

GraphQL on the other hand is pretty powerful in terms of data.

[Graph.cool](https://www.graph.cool) is my main choice, simply because:

- It has free tier
- UI is pretty nice and makes a lot of sense all the time
- Unrestricted integration with other 3rd party providers
- Unrestricted number of functions call

### Frontend

I decided to use React for this branch, because GraphQL is popularly used with Apollo, which in turn is used better with React.

One of the reason I did not want to use `create-react-app` was because it does a full page reload on every single changes. This makes developing features really slow, because you lose the context everytime.

Fortunately, I found this page (https://medium.com/superhighfives/hot-reloading-create-react-app-73297a00dcad) and a way to get a similar experience as with VueJS.