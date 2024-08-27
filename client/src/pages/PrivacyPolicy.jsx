import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import { Link } from "react-router-dom";
import useScrollTo from "../components/useScrollTo";
const PrivacyPolicy = () => {
  useScrollTo();

  const breadlinks = [
    {
      url: "/",
      text: "Home",
    },
    {
      url: "/privacypolicy",
      text: "Privacy Policy",
    },
  ];
  return (
    <div>
      <Header />
      <main>
        {" "}
        <Breadcrumb
          pagename={"Privacy Policy"}
          breadcrumbitems={breadlinks}
          backgroundimg={"assets/images/breadcrumb/bg_14.jpg"}
        />
        <section className="privacy-policy-section">
          <div className="privacy container p-5">
            <div className="conditions mb-5">
              <div className>
                <h2>PRIVACY POLICY</h2>
                <hr />
                <p>
                  This Privacy Policy describes how Intoggle Here manage
                  personal information and respect your privacy. This policy may
                  be amended from time to time.
                </p>
                <ol>
                  <li>
                    {" "}
                    Collection of Personal Information: As a visitor to the
                    Site, you can engage in many activities without providing
                    any Personal Information. Depending upon the activity, some
                    of the information that we ask you to provide is identified
                    as mandatory and some as voluntary. If you do not provide
                    the mandatory data with respect to a particular activity,
                    you will not be able to engage in that activity. However,
                    when you register to use a Intoggle Here and order products
                    as a Intoggle Here customer, in order to provide the
                    services to you, we may collect your contact information
                    such as your name, phone numbers, address and email address
                    as well as profile information, including your password,
                    details about your purchases and details about your
                    interactions with us.
                  </li>
                  <li>
                    {" "}
                    Updating your Personal Information: You have the right to
                    access and correct, or delete your Personal Information and
                    privacy preferences at any time. This may be accomplished by
                    clicking on the link, "My Profile", where you can view and
                    make changes to most of your Personal Information
                    immediately. For security purposes, certain Personal
                    Information can only be changed by contacting support. We
                    will respond to your request promptly within a reasonable
                    time.
                  </li>
                  <li>
                    {" "}
                    How your Personal Information is used: Intoggle Here
                    collects your information in order to provide services to
                    you, comply with our legal obligations, and to improve our
                    products and services. We do not sell, rent or share your
                    personally identifiable information to or with third parties
                    in any way other than as disclosed in this Privacy Policy.
                    Intoggle Here may use this information to -
                    <ol>
                      <li>
                        {" "}
                        Process your financial transactions; Service your order.
                      </li>
                      <li>
                        {" "}
                        Respond to customer service requests, questions and
                        concerns.
                      </li>
                      <li>Administer your account.</li>
                      <li>
                        {" "}
                        Send you requested product or service information.
                      </li>
                      <li>
                        {" "}
                        Keep you informed about special offers and services of
                        IGP and selected third parties.
                      </li>
                      <li>
                        {" "}
                        Administer promotions and notify you of important
                        events.
                      </li>
                      <li>
                        {" "}
                        Investigate, prevent or take action regarding illegal
                        activities and/or violations of our Terms of Service.
                      </li>
                      <li>
                        {" "}
                        Meet our research and product/service development needs
                        and to improve our Site, services and offerings.
                      </li>
                      <li>
                        {" "}
                        Intoggle your experience, including targeting our
                        services and offerings to you.
                      </li>
                    </ol>
                  </li>
                  <li>
                    {" "}
                    In certain situations, Intoggle Here may be required to
                    disclose personal data in response to lawful requests by
                    public authorities. Where required by law (like to comply
                    with a warrant, court order, or legal notice served on
                    Intoggle Here), and when we believe that disclosure is
                    necessary to protect our rights, avoid litigation, protect
                    your safety or the safety of others, investigate fraud,
                    and/or respond to a government request. We may also disclose
                    information about you if we determine that such disclosure
                    should be made for reasons of national security, law
                    enforcement, or other issues of public importance.
                  </li>
                  <li>
                    {" "}
                    Information sharing with service providers: Intoggle Here
                    uses one or more outside payment processing companies to
                    bill you for our goods and services. To the best of our
                    knowledge, these companies do not retain, share, store or
                    use personally identifiable information for any other
                    purpose. We also share Personal Information with certain
                    companies that perform services on our behalf. We only share
                    the Personal Information which is necessary for them to
                    perform those services. We require any company with which we
                    may share Personal Information to protect that data in a
                    manner consistent with this policy and to limit the use of
                    such Personal Information to the performance of services for
                    IGP. We do not sell or otherwise provide Personal
                    Information to other companies for the marketing of their
                    own products or services.
                  </li>
                  <li>
                    {" "}
                    Data Retention: We will retain your information for as long
                    as your account is active, your information is needed to
                    provide you services, or as required to fulfill our legal
                    obligations. If you wish to delete your account or request
                    that we no longer use your information to provide you
                    services contact us at care.intoggle@gmail.com. We will
                    respond to your request within reasonable time. We will
                    retain and use your information as necessary to comply with
                    our legal obligations, resolve disputes and enforce our
                    agreements.
                  </li>
                  <li>
                    {" "}
                    Unsubscribe/Opt Out: You may opt out of receiving Intoggle
                    Here's email updates, newsletters and/or partner emails by
                    clicking on the "My Profile" link on the website and making
                    the appropriate selections. The choice to opt out of such
                    communications is also generally available during the
                    sign-up process. Intoggle Here will still contact you when
                    there are changes to the Terms of Service or Submitter Terms
                    of Service, as applicable. In addition, we will still send
                    you service-related announcements including, but not limited
                    to, a registration email, order related notifications and
                    emails automatically triggered by actions you took on the
                    Site. Generally, you may not opt-out of these
                    communications, which are not promotional in nature.
                  </li>
                  <li>
                    {" "}
                    Protection of your Personal Information: The Personal
                    Information that you provide in connection with the use of
                    the Site is protected in several ways. It resides on secure
                    servers that only selected Intoggle Here personnel have
                    access to via password. Your Personal Information is
                    encrypted whenever it is transmitted to Intoggle Here .
                    When you enter sensitive information (such as credit card
                    number) on our registration or order forms, we encrypt that
                    information using transport layer security technology. We
                    strive to protect the Personal Information submitted to us,
                    both during transmission and once we receive it. However, no
                    method of transmission over the Internet, or method of
                    electronic storage, is 100% secure. While we take into
                    account the sensitivity of the Personal Information we
                    collect, process and store, and the current state of
                    technology to use these measures protect your Personal
                    Information, we cannot guarantee its absolute security. If
                    you have any questions, doubts or confusion in regard to any
                    of the terms set out here in the privacy policy, please seek
                    clarifications from us through email
                    (care.intoggle@gmail.com). We will get back to you
                    within reasonable time.
                  </li>
                </ol>
                <p>
                  <br />
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
