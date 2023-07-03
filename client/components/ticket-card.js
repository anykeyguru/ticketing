import React, {useEffect} from 'react';
import Image from 'next/image';
import useRequest from "../hooks/use-request";

import ticketIco from '../public/assets/images/ticket-icon-png-5.jpg'
import Router from "next/router";
import Link from "next/link";

const TicketCard = ({title, price, id, errorHandler}) => {
    // const {doRequest, errors} = useRequest({
    //     url: `/api/orders`,
    //     method: 'post',
    //     body: {"ticketId": id},
    //     onSuccess: () => {
    //         // Router.push('/');
    //     },
    // });

    const handleOrder = (e) => {
        e.preventDefault();
        Router.push(`/tickets/${id}`)

    }
    // useEffect(() => {
    //     errorHandler(errors);
    // }, [errors])
    return (
        <div className="col">
            <div className="card">
                <Image className="rect align-content-center" src={ticketIco} alt="My Image" width={100} height={100}/>
                <div className="card-body">
                    <h5 className="card-title">{title}</h5> <h3>${price}</h3>
                    <p className="card-text">This is a longer card with supporting text below as a natural lead-in
                        to additional content. This content is a little bit longer.</p>
                    <a className="btn btn-danger" onClick={(e) => handleOrder(e)}>Detail</a>
                    <Link href="/tickets/[ticketId]" as={`/tickets/${id}`}>
                        View
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TicketCard;