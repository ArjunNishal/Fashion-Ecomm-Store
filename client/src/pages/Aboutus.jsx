import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import { Link } from "react-router-dom";
import useScrollTo from "../components/useScrollTo";
import NewsLetter from "../components/NewsLetter";

const Aboutus = () => {
  useScrollTo();

  const breadlinks = [
    {
      url: "/",
      text: "Home",
    },
    {
      url: "/aboutus",
      text: "About us",
    },
  ];
  return (
    <div>
      <Header />
      <main>
        {" "}
        <Breadcrumb
          pagename={"About us"}
          breadcrumbitems={breadlinks}
          backgroundimg={"assets/images/breadcrumb/bg_14.jpg"}
        />
        <section className="aboutus-section py-5">
          <div className="container">
            <div className="about-us-area section-ptb">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="about-us-contents">
                      <h3>
                        Welcome To <span className="span-red-text">Ecomm</span>
                      </h3>
                      <p>
                        A revolutionary zero-investment startup founded by john.
                        Our focus is on offering a diverse range of personalized
                        products that cater to unique preferences. At Ecomm, we
                        believe in more than just trading merchandise; we're
                        here to encapsulate emotions and forge a special
                        connection with our customers.
                      </p>
                      <h4>Our Personalized Touch</h4>
                      <p>
                        We meticulously curate a variety of customized items,
                        creating a personal resonance with our customers.
                        Witness the joy on our customers' faces as they receive
                        creations tailored to their desires and requirements.
                      </p>
                      <div className="about-us-btn">
                        <Link
                          to="/categories"
                          className="custom_btn  btn_sm bg_sports_red text-uppercase"
                        >
                          Shop now
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 ">
                    <div className="about-us-image text-right">
                      <img
                        src="/assets/images/blog/sports/img_01.jpg"
                        alt="img"
                      />
                    </div>
                  </div>
                  <div className="col-12 py-5">
                    <h4>
                      Guiding Principle - "Customised Products at Competitive
                      Price Range"
                    </h4>
                    <p>
                      With an infinite range of design and customization
                      possibilities, we transcend limits to bring your ideas to
                      life. Our primary product line features Customized wallet
                      for men, Customised wallet gift, Customised water bottle,
                      and Customised passport cover. However, we go beyond to
                      offer a diverse range, including customised t-shirts,
                      corporate combos, Men's kada , Kaapu , bracelet, wood
                      engraving, and corporate gifts.
                    </p>
                    <h4>Customer Loyalty and Growth</h4>
                    <p>
                      Our success lies in customers consistently returning for
                      their gifting and customized product needs. This loyalty
                      has led to our diversification, proudly offering over 60
                      unique items. From humble beginnings, we've become one of
                      the foremost leather engravers in the nation.
                    </p>
                    <p>
                      Website:{" "}
                      <a className="text-danger" href="https://intoggle.com/">
                        intoggle.com
                      </a>
                    </p>
                    <p>
                      Discover the transformative power of customization with
                      Ecomm – where every product becomes a canvas for emotions
                      and individuality. Join us on this exciting journey of
                      crafting personalized experiences that leave a lasting
                      smile on your face. Explore our offerings, including Gift
                      for men, Anniversary gifts, Personalized gifts, Christmas
                      gift ideas, Gift ideas, Gifts for him, Gift shop,
                      Anniversary quotes,Gift ideas for women, Gift ideas for
                      secret Santa and Gifts for boyfriend.
                    </p>
                    <p>
                      Embark on a personalized journey with us, as we redefine
                      gifting and customization. Ecomm is not just a brand; it's
                      an experience, and we invite you to
                      be&nbsp;a&nbsp;part&nbsp;of&nbsp;it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <NewsLetter />
      </main>
      <Footer />
    </div>
  );
};

export default Aboutus;
