import 'bootstrap/dist/css/bootstrap.css';
import Link from 'next/link';

export default ({currentUser}) => {
    const links = [
        !currentUser && {label: 'Sign In', href: '/auth/signin', k: "asdfhgkasd"},
        !currentUser && {label: 'Sign Up', href: '/auth/signup', k: "asdfasbvdsd"},
        currentUser && {label: 'Sell Tickets', href: '/tickets/new', k: "asddsfvfasd"},
        currentUser && {label: 'My Orders', href: '/orders', k: "asdsd"},
        currentUser && {label: 'Sign Out', href: '/auth/signout', k: "asdfdgfdhsasd"},
    ]
        .filter(linkConfig => linkConfig)
        .map(({label, href, k}, i) => {
            return (
                <li key={k} className="nav-item">
                    <Link key={href} href={href} className="nav-link">
                        {label}
                    </Link>
                </li>
            );
        });

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid ">
                <Link key="dsfdsfdsf" href="/" className='navbar-brand'>
                    GitTix
                </Link>
                <div className="collapse navbar-collapse justify-content-end">
                    <ul className="nav d-flex align-items-center">{links}</ul>
                </div>
            </div>
        </nav>
    )
};