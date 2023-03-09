import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request'
export default () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/users/signin',
        method: "post",
        body: {
            email, password
        },
        onSuccess: () => Router.push('/')
    });

    // Submit handler
    const onSubmit = async (e) => {
        e.preventDefault();
        await doRequest();

    }

    return (
        <div>

            <div className="row m-5">
                <div className="col-3">
                    <form className="form" onSubmit={onSubmit}>
                        <h2>Sign In</h2>

                        <div className="form-group mb-3">
                            <label >Email adress</label>
                            <input
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                type="text" className="form-control" />
                        </div>
                        <div className="form-group mb-3">
                            <label >Password</label>
                            <input
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                type="password" className="form-control" />
                        </div>
                        <div className='row justify-content-start'>
                            <div className="col-4"><button className="btn btn-primary">Sign In</button></div>
                            <div className="col-6">Have no Account? <a href="/auth/signup">Sign Up</a></div>
                        </div>


                    </form>
                </div>
            </div>

            <div className="row m-5">
                <div className="col-6"></div>
                <div className="col-8">
                    {errors}
                </div>
            </div>

        </div>
    )
}