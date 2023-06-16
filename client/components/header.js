import 'bootstrap/dist/css/bootstrap.css';
import Link from 'next/link';

export default ({currentUser}) => {
    const links = [
        !currentUser && {label: 'Sign In', href: '/auth/signin'},
        !currentUser && {label: 'Sign Up', href: '/auth/signup'},
        currentUser && {label: 'New Ticket', href: '/tickets/new'},
        currentUser && {label: 'Sign Out', href: '/auth/signout'},
    ]
        .filter(linkConfig => linkConfig)
        .map(({label, href}) => {
            return (
                <li key={href} className="nav-item">
                    <Link href={href} className="nav-link">
                        {label}
                    </Link>
                </li>
            );
        });

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid ">
                <Link href="/" className='navbar-brand'>
                    GitTix
                </Link>
                <div className="collapse navbar-collapse justify-content-end">
                    <ul className="navbar-nav">
                        {links}
                    </ul>
                </div>
            </div>
        </nav>
    )
};