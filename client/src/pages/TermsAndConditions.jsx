import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import { Link } from "react-router-dom";
import useScrollTo from "../components/useScrollTo";

const TermsAndConditions = () => {
  useScrollTo();

  const breadlinks = [
    {
      url: "/",
      text: "Home",
    },
    {
      url: "/termsandconditions",
      text: "Terms & Conditions",
    },
  ];
  return (
    <div>
      <Header />
      <main>
        {" "}
        <Breadcrumb
          pagename={"Terms & Conditions"}
          breadcrumbitems={breadlinks}
          backgroundimg={"assets/images/breadcrumb/bg_14.jpg"}
        />
        <section className="termsndconditions">
          <div className="container p-5">
            <h3>TERMS AND CONDITIONS</h3>
            <hr />
            <div>
              <div>
                <p>
                  This website is managed by your Intoggle Here . Throughout
                  the site, the terms “we”, “us” and “our” refer to the team at
                  Intoggle Here .We make this website, including all the
                  services available on this site to the user once and only if
                  the user accepts all the stated terms, conditions, and
                  policies.
                </p>
                <p>
                  These Terms, Conditions, and Policies apply to all users of
                  the site i.e. browsers and customers.
                </p>
                <p>
                  Please read these carefully before using our website.
                  <br />
                  If you do not agree with all the terms and conditions of this
                  agreement, then you may not access or use any services on this
                  website.
                </p>
                <p>
                  <u> </u>
                </p>
                <li>
                  <b> Changes to the T&amp;C</b>
                </li>
                <p>
                  We reserve the right to update any part of these Terms of Use
                  on our website. We are not liable for any issues arising due
                  to the modified T&amp;C as it is the consumers’ duty to keep
                  themselves updated with our terms.
                </p>
                <li>
                  <b> Right to Refuse Service</b>
                </li>
                <p>
                  We hold the right to refuse service to any party at any time.
                  We are not obligated to share the reason for refusal for the
                  same.
                  <br />
                  We reserve the right to limit or prohibit orders that appear
                  to be placed by dealers, resellers or distributors.
                </p>
                <p>
                  In case of any discrepancies, the verdict of Intoggle Here
                  will be final and binding.
                </p>
                <li>
                  <b>User Agreement</b>
                </li>
                <p>
                  The user must agree not to duplicate, resell, or exploit the
                  services that are delivered to them by Gift Studio. The
                  content on our website and portal must not be duplicated or
                  reproduced in any way.
                  <br />
                  In case of any suggestions, queries, or requests regarding the
                  same, contact us at care.intoggle@gmail.com
                </p>
                <li>
                  <b>Modification in Services and Prices</b>
                </li>
                <p>
                  We reserve the right to modify our services or prices without
                  prior notice.
                  <br />
                  However, if a service has already been paid for at a
                  particular price, the changes would not apply to that order.
                </p>
                <li>
                  <b> User Submissions</b>
                </li>
                <p>
                  If the users send certain submissions for contest/campaign
                  entries we hold the right to edit, copy, publish, or use those
                  submissions. We are under no obligation to pay compensation
                  for any submissions or respond to any submissions.
                </p>
                <p>
                  We reserve the right to edit or remove content that is
                  objectionable.
                </p>
                <li>
                  <b>Usage of Personal Information</b>
                </li>
                <p>
                  The personal information of our users is safeguarded by us. In
                  no case would this information be disclosed or misused. For
                  more details, kindly read our privacy policy.
                </p>
                <li>
                  <b> Changes to the Terms of Service</b>
                </li>
                <p>
                  We at Intoggle Here reserve the right to update and modify
                  any segment of the Terms, Conditions, and Policies on our
                  website.
                  <br />
                  You can review the most current version of the Terms of
                  Service at any time on the site.
                </p>
                <p>
                  Your continued use of or access to our website or the Service
                  following the posting of any changes to these Terms of Service
                  constitutes acceptance of those changes.
                </p>
                <p>
                  Browsing this website implies that you agree to all the Terms,
                  Conditions, and Policies on this website. Please read the
                  Terms, Conditions, and Policies to ensure awareness and
                  transparency before proceeding.
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

export default TermsAndConditions;
