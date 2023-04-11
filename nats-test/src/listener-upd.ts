import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketUpdatedListener } from './events/ticket-updated-listener';


// console.clear();


const stan = nats.connect('ticketing', `listener-update-t-${randomBytes(4).toString('hex')}`, {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Listener connected to NATS');
    stan.on('close', () => {
        console.log('NATS connection closed');
        stan.close();
        process.exit();
    });

    new TicketUpdatedListener(stan).listen();

});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());




