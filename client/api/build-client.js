import axios from 'axios';

export default ({ req }) => {
    if (typeof window === 'undefined') {
        // SERVER SIDE
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        })
    } else {
        // BROWSER SIDE
        return axios.create({
            baseURL: '/'
        })
    }
}