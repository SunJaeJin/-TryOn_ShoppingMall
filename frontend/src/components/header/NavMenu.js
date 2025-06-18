import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

const NavMenu = ({ menuWhiteClass, sidebarMenu }) => {
  //해당 프로젝트에서 번역 기능 사용하지 않음
  //const { t } = useTranslation();
  return (
    <div
      className={clsx(sidebarMenu
        ? "sidebar-menu"
        : `main-menu ${menuWhiteClass ? menuWhiteClass : ""}`)}
    >
      <nav>
        <ul>
          <li>
            <Link to={process.env.PUBLIC_URL + "/home-fashion"}>
              {/*t("Home") 번역기 사용시 코드 나머지도 동일*/}
              {"Home"}
            </Link>
          </li>
          {/* <li>
            <Link to={process.env.PUBLIC_URL + "/"}>
              {t("Admin")}
              {sidebarMenu ? (
                <span>
                  <i className="fa fa-angle-right"></i>
                </span>
              ) : (
                <i className="fa fa-angle-down" />
              )}
            </Link>
            <ul className="mega-menu mega-menu-padding">
              <li>
                <ul>
                  <li className="mega-menu-title">
                    <Link to={process.env.PUBLIC_URL + "/"}>
                      {t("")}
                    </Link>
                  </li>
                    <Link to={process.env.PUBLIC_URL + "/Product-Register"}>
                      {t("상품 등록")}
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <ul>
                  <li className="mega-menu-title">
                    <Link to={process.env.PUBLIC_URL + "/"}>
                      {t("")}
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </li> */}
          <li>
            <Link to={process.env.PUBLIC_URL + "/shop-grid-no-sidebar"}>
              {/*t("Shop")*/}
              {"Shop"}
            </Link>
          </li>
          <li>
  <Link to={process.env.PUBLIC_URL + "/Product-Register"}>
    {"Product Registration"}
  </Link>
</li>

          <li>
            <Link to={process.env.PUBLIC_URL + "/"}>
              {/*t("pages")*/}
              {"pages"}
              {sidebarMenu ? (
                <span>
                  <i className="fa fa-angle-right"></i>
                </span>
              ) : (
                <i className="fa fa-angle-down" />
              )}
            </Link>
            <ul className="submenu">
              <li>
                <Link to={process.env.PUBLIC_URL + "/cart"}>
                  {"cart"}
                </Link>
              </li>
              {/* <li>
                <Link to={process.env.PUBLIC_URL + "/checkout"}>
                  {t("checkout")}
                </Link>
              </li> */}
              <li>
                <Link to={process.env.PUBLIC_URL + "/wishlist"}>
                  {"wishlist"}
                </Link>
              </li>
              {/* <li>
                <Link to={process.env.PUBLIC_URL + "/compare"}>
                  {t("compare")}
                </Link>
              </li> */}
              <li>
                <Link to={process.env.PUBLIC_URL + "/my-account"}>
                  {"my_account"}
                </Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/login-register"}>
                  {"login_register"}
                </Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/Product-Register" /* "/about"*/}>
                  {""}
                </Link>
              </li>
              {/* <li>
                <Link to={process.env.PUBLIC_URL + "/contact"}>
                  {t("contact_us")}
                </Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/not-found"}>
                  {t("404_page")}
                </Link>
              </li> */}
            </ul>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + "/blog-no-sidebar"}>
              {"Community"}
            </Link>
          </li>
          {/* <li>
            <Link to={process.env.PUBLIC_URL + "/contact"}>
              {"contact_us"}
            </Link>
          </li> */}
          {localStorage.getItem("isAdmin") && (
            <li>
            <Link to={process.env.PUBLIC_URL + "/admin-page"}>
              {"Admin"}
            </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

NavMenu.propTypes = {
  menuWhiteClass: PropTypes.string,
  sidebarMenu: PropTypes.bool,
};

export default NavMenu;
