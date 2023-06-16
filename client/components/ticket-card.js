import React from 'react';
import Image from 'next/image';
import useRequest from "../hooks/use-request";

import ticketIco from '../public/assets/images/ticket-icon-png-5.jpg'
import Router from "next/router";

const TicketCard = ({title, price, id}) => {
    const {doRequest, errors} = useRequest({
        url: `/api/orders`,
        method: 'post',
        body: {"ticketId": id},
        onSuccess: () => {
            Router.push('/');
        },
    });
    const handleOrder = async () => {
        await doRequest()
    }
    return (
        <div className="col">
            <div className="card">
                <Image className="rect" src={ticketIco} alt="My Image" width={100} height={100}/>
                <div className="card-body">
                    <h5 className="card-title">{title}</h5> <h3>${price}</h3>
                    <p className="card-text">This is a longer card with supporting text below as a natural lead-in
                        to additional content. This content is a little bit longer.</p>
                    <a href="#" className="btn btn-danger" onClick={() => handleOrder()}>Order</a>
                </div>
            </div>
        </div>
    );
};

export default TicketCard;