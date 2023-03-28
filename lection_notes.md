kubectl create secret generic next-telemetry-disable  --from-literal=NEXT_TELEMETRY_DISABLED=1
kubectl create secret generic next-telemetry --from-literal=NEXT_TELEMETRY=1
kubectl create secret generic jwt-secret --from-literal=jwt=secretword

================


globalThis has no index signature TS Error

In the upcoming lecture (and later with the ticketing, orders and payments services) you may end up seeing a TS error like this in your test/setup.ts file:

Element implicitly has an 'any' type because type 'typeof globalThis' has no index signature.ts(7017)

To fix, find the following lines of code in src/test/setup.ts:

    declare global {
      namespace NodeJS {
        export interface Global {
          signin(): Promise<string[]>;
        }
      }
    }

change to:

        declare global {
          var signin: () => Promise<string[]>;
        }


### Suggestion Regarding a Default Export Warning

In the upcoming lecture, we will create our first components and run the Next server. You may see a warning in the terminal or browser console:

Anonymous arrow functions cause Fast Refresh to not preserve local component state.

Please add a name to your function, for example:

Before

export default () => <div />;

After

const Named = () => <div />;

export default Named;

This is a linter warning as of React v17 letting us know that it might be wise to use named exports instead.

You can suppress the warning by refactoring from this:

    export default () => {
      return <h1>Landing Page</h1>;
    };

to this:

    const Landing = () => {
      return <h1>Landing Page</h1>;
    };
     
    export default Landing;

The warning will come up a few more times in this project (and throughout the course) when creating components and can be handled similarly.

### Small Update for Custom Webpack Config

In the upcoming lecture, we will be creating a next.config.js file and adding some configuration to it. The latest versions of Next.js use a newer version of Webpack which moves watchOptions out from webpackDevMiddleware.

So, the next.config.js file should now look like this:

    module.exports = {
      webpack: (config) => {
        config.watchOptions.poll = 300;
        return config;
      },
    };


Note - If you are using the Next.js / React app and versions from the course resources this change does not apply.


### A note about ECONNREFUSED errors

In the upcoming lecture at about the 4:10 timestamp, we will be moving the axios request from the getInitialProps function directly to the LandingPage as part of an explanation. This will likely fail with a long ECONNREFUSED error in your Skaffold output.

Node Alpine Docker images are now likely using the v16 version of Node, so, we will again encounter a situation that will require a catch block.

Change this code in client/pages/index.js

    const LandingPage = ({ currentUser }) => {
      console.log(currentUser);
      axios.get('/api/users/currentuser');
     
      return <h1>Landing Page</h1>;
    };

to this:

    const LandingPage = ({ currentUser }) => {
      console.log(currentUser);
      axios.get('/api/users/currentuser').catch((err) => {
        console.log(err.message);
      });
     
      return <h1>Landing Page</h1>;
    };

### Typo in package.json "files" Field - Do Not Skip

In the upcoming lecture, there is a small typo in the files field of the package.json. The video was edited with a callout at around the 1:48 timestamp, however, many students appear to be missing this fix.

Make sure you update this line:

    "files": [
      "./build/**/*"
    ],

to this:

    "files": [
      "build/**/*"
    ],

In the upcoming lecture, we will be updating our src/test/setup.ts file.

As a reminder, your global signin declaration should look like this after the refactor:

declare global {
  var signin: () => string[];
}
One small fix is required to return the cookie to prevent our tests from failing:

Find the return of the global.signin method and change this:

  return [`express:sess=${base64}`];

to this:

  return [`session=${base64}`];