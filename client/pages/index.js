import buildClient from "../api/build-client";
import {useEffect, useState} from "react";
import TicketCard from "../components/ticket-card";

const LandingPage = ({currentUser, tickets}) => {
    const [errRor, setError] = useState("")
    const errorHandler = async (status) => {
        setError(status);
        const timer = setTimeout(() => {
            setError("")
        }, 3000)
    }
    useEffect(() => {
        // Perform any side effects or additional logic based on the error state here
        // This will be triggered whenever the error state changes

    }, [errRor]);
    return (
        <div className="container">
            {
                currentUser ? <h1>You are signed in</h1> : <h1>You are Not signed in :(</h1>

            }
            {
                errRor ? <div className="row m-5">
                    <div className="col-6"></div>
                    <div className="col-8">
                        {errRor}
                    </div>
                </div> : ""
            }

            <div className="row row-cols-6 row-cols-md-5 g-4">
                {
                    tickets ? tickets.map(ticket => (
                        <TicketCard key={ticket.id} errorHandler={errorHandler} id={ticket.id} title={ticket.title}
                                    price={ticket.price}/>)) : ""
                }
            </div>
        </div>
    )

};

LandingPage.getInitialProps = async (context, client, currentUser) => {
    const {data} = await client.get('/api/tickets');
    console.log(data)
    return {tickets: data};

};

export default LandingPage;
