import {useEffect, useState} from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const OrderShow = ({order, currentUser}) => {
    const [timeLeft, setTimeLeft] = useState(0)
    const {doRequest, errors} = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {orderId: order.id},
        onSuccess: () => {
            Router.push('/orders')
        }

    })

    useEffect(() => {
        const findTimeLeft = () => {
            // Get the current time
            const now = new Date();
            // Define the given time
            const givenTime = new Date(order.expiresAt);
            // Calculate the time difference in milliseconds
            const msLeft = givenTime - now;
            // Convert milliseconds to minutes
            // var minutesDiff = Math.floor(msLeft / (1000 * 60));
            const minutesDiff = Math.round(msLeft / (1000));
            setTimeLeft(minutesDiff)
        }

        const timerId = setInterval(findTimeLeft, 1000)

        return () => {
            clearInterval(timerId);
        };

    }, [order]);


    if (timeLeft < 0) {
        return (
            <div>Order expired</div>
        )
    }

    return (
        <div>
            <div>ID: {order.id}</div>
            <h1>{order.status}</h1>
            <h3> Time left to pay {timeLeft} seconds</h3>
            <StripeCheckout
                token={({id}) => doRequest({token: id})}
                stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUB_KEY}
                amount={order.ticket.price * 100}
                email={currentUser.email}
            />
            {errors}
        </div>
    );
}

OrderShow.getInitialProps = async (context, client) => {
    const {orderId} = context.query;
    const {data} = await client.get(`/api/orders/${orderId}`);
    return {order: data}
}

export default OrderShow;