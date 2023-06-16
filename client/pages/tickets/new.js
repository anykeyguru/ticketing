import {useState} from "react";
import Router from 'next/router'
import useRequest from "../../hooks/use-request";

const NewTicket = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const {doRequest, errors} = useRequest({
        url: "/api/tickets",
        method: 'post',
        body: {
            title, price
        },
        onSuccess: () => {
            Router.push('/');
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await doRequest();
    }

    const onBlur = () => {
        const value = parseFloat(price);
        if (isNaN(value)) {
            return;
        }
        setPrice(value.toFixed(2));
    };
    return (<div>
            <div className="container">
                <div className="row">
                    <div className="col-7">
                        <h1> Create a ticket</h1>
                        <form>
                            <div className="form-group">
                                <label htmlFor="title">Title:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    name="title"
                                    placeholder="Enter title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="price">Price:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="price"
                                    name="price"
                                    placeholder="Enter price"
                                    onBlur={onBlur}
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                            <div>
                                <button type="submit" className="btn btn-primary"
                                        onClick={e => handleSubmit(e)}>Submit
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
            <div className="row m-5">
                <div className="col-6"></div>
                <div className="col-8">
                    {errors}
                </div>
            </div>

        </div>
    );
};

export default NewTicket;