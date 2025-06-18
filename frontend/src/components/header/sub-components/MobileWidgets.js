

const MobileWidgets = () => {
  return (
    <div className="offcanvas-widget-area">
      <div className="off-canvas-contact-widget">
        <div className="header-contact-info">
          <ul className="header-contact-info__list">
            <li>
              <i className="fa fa-phone"></i>{" "}
              <a href="tel://12452456012">(1245) 2456 012 </a>
            </li>
            <li>
              <i className="fa fa-envelope"></i>{" "}
              <a href="#!">info@yourdomain.com</a>
            </li>
          </ul>
        </div>
      </div>
      {/*Off Canvas Widget Social Start*/}
      <div className="off-canvas-widget-social">
        <a href="#!" title="Twitter">
          <i className="fa fa-twitter"></i>
        </a>
        <a href="#!" title="Instagram">
          <i className="fa fa-instagram"></i>
        </a>
        <a href="#!" title="Facebook">
          <i className="fa fa-facebook"></i>
        </a>
        <a href="#!" title="Pinterest">
          <i className="fa fa-pinterest"></i>
        </a>
      </div>
      {/*Off Canvas Widget Social End*/}
    </div>
  );
};

export default MobileWidgets;
