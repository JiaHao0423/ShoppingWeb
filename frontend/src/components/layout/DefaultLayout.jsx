import Header from "./Header/Header.jsx";
import Footer from "./Footer/Footer.jsx";

const DefaultLayout = ({children,variant = "default"}) => {
    return (
        <>
            <Header variant ={variant}/>
            {children}
            <Footer/>
        </>
    )
}

export default DefaultLayout