import 'bootstrap/dist/css/bootstrap.css';
import styles from '../public/assets/syles/styles.css'
import buildClient from "../api/build-client";
import Header from "../components/header"


const AppComponent = ({Component, pageProps, currentUser}) => {
    return <div>
        <div className="container"></div>
        <Header currentUser={currentUser}/>
        <Component {...pageProps} currentUser={currentUser}/>
    </div>
};

AppComponent.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx);
    const {data} = await client.get('/api/users/currentuser');
    let pageProps = {};

    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser)
    }
    return {
        pageProps,
        currentUser: data.currentUser
    };
};

export default AppComponent;