import Benefits from "../components/Benifit";
import { Features } from "../components/Feature";
import { FeelingCheck } from "../components/FeelingCheck";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      {/* <FeelingCheck /> */}
      <Benefits/>
      <Footer/>
    </>
  );
};
export default Home;
