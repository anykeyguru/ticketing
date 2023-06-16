import buildClient from "../api/build-client";
import TicketCard from "../components/ticket-card";

const LandingPage = ({currentUser, tickets}) => {
    return (
        <div>
            {
                currentUser ? <h1>You are signed in</h1> : <h1>You are Not signed in :(</h1>

            }
            <div className="row row-cols-1 row-cols-md-5 g-4">
                {
                    tickets ? tickets.map(ticket => (
                        <TicketCard key={ticket.id} id={ticket.id} title={ticket.title} price={ticket.price}/>)) : ""
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
