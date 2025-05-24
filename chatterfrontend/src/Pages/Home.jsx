import { Link } from "react-router"
import Navbar from "../Component/Common/Navbar";

const Home = () =>{

    return(
        <div>
            {/*Section 1*/}
            <div>
                <Link to={"/signup"}>
                    <p>New User? Register Here!!</p>
                </Link>
            </div>
            <div>
                <Link to={"/login"}>
                    <p>Registerd? Login!!</p>
                </Link>
            </div>
            {/*Heading*/}
        </div>
    )
};

export default Home;