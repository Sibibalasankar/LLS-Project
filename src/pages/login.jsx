    import '../assets/styles/login.css'
import Header from '../components/Header';

    const login = () => {
    return <>
    <Header/>
    
    <div className="container-fluid main_div">
        <div className="top"></div>
        <div className="child1">
            <button className='btn_login'>Admin Login</button>
            <button className='btn_login'>User Login</button>
        </div>
    </div>
    </>;
    };

    export default login;
