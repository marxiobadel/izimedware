import React, { useState } from "react";
import { Modal, Nav, Tab } from "react-bootstrap";
import { Link } from "react-router-dom";
import avater1 from "../../../../../images/avatar/1.jpg";
import product1 from "../../../../../images/product/1.jpg";
import product2 from "../../../../../images/product/2.jpg";
import product3 from "../../../../../images/product/3.jpg";
import product4 from "../../../../../images/product/4.jpg";
import tab1 from "../../../../../images/tab/1.jpg";
import tab2 from "../../../../../images/tab/2.jpg";
import tab3 from "../../../../../images/tab/3.jpg";
import tab4 from "../../../../../images/tab/4.jpg";
import PageTitle from "../../../../layouts/PageTitle";

const ProductDetail = () => {
  const [reviewToggle, setReviewToggle] = useState(false);
  const [active , setActive] = useState("")
  return (
    <>
      <PageTitle pageContent="Product Details" motherMenu="Shop" activeMenu="Product Detail" />
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-xl-3 col-lg-6  col-md-6 col-xxl-5 ">
                  {/* Tab panes */}
                  <Tab.Container defaultActiveKey="first">
                    <Tab.Content>
                      <Tab.Pane eventKey="first">
                        <img className="img-fluid" src={product1} alt="" />
                      </Tab.Pane>
                      <Tab.Pane eventKey="second">
                        <img className="img-fluid" src={product2} alt="" />
                      </Tab.Pane>
                      <Tab.Pane eventKey="third">
                        <img className="img-fluid" src={product3} alt="" />
                      </Tab.Pane>
                      <Tab.Pane eventKey="four">
                        <img className="img-fluid" src={product4} alt="" />
                      </Tab.Pane>
                    </Tab.Content>
                    <div className="tab-slide-content new-arrival-product mb-4 mb-xl-0">                      
                      <Nav
                        as="ul"
                        className="nav slide-item-list mt-3"                        
                      >
                        <Nav.Item as="li">
                          <Nav.Link as="a" eventKey="first" to="#first">
                            <img
                              className="img-fluid"
                              src={tab1}
                              alt=""
                              width={50}
                            />
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                          <Nav.Link as="a" eventKey="second" to="#second">
                            <img
                              className="img-fluid"
                              src={tab2}
                              alt=""
                              width={50}
                            />
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                          <Nav.Link as="a" eventKey="third" to="#third">
                            <img
                              className="img-fluid"
                              src={tab3}
                              alt=""
                              width={50}
                            />
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                          <Nav.Link as="a" to="#for" eventKey="four">
                            <img
                              className="img-fluid"
                              src={tab4}
                              alt=""
                              width={50}
                            />
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>
                  </Tab.Container>
                </div>
                {/*Tab slider End*/}

                <div className="col-xl-9 col-lg-6  col-md-6 col-xxl-7 col-sm-12">
                  <div className="product-detail-content">
                    {/*Product details*/}
                    <div className="new-arrival-content pr">
                      <h4>RadiantGlow Serum</h4>
                      <div className="comment-review star-rating">
                        <ul>
                          {" "}
                          <li>
                            <i className="fa fa-star" />
                          </li>{" "}
                          <li>
                            <i className="fa fa-star" />
                          </li>{" "}
                          <li>
                            <i className="fa fa-star" />
                          </li>{" "}
                          <li>
                            <i className="fa-solid fa-star-half-stroke" />
                          </li>{" "}
                          <li>
                            <i className="fa-solid fa-star-half-stroke" />
                          </li>
                        </ul>
                        <span className="review-text">(34 reviews) / </span>
                        <Link
                          onClick={() => setReviewToggle(true)}
                          className="product-review"
                          to="/ecom-product-detail"
                          data-toggle="modal"
                          data-target="#reviewModal"
                        >
                          Write a review?
                        </Link>
                      </div>
                      <div className="d-table mb-2">
                        <p className="price float-left d-block">$325.00</p>
                      </div>
                      <p>
                        Availability:{" "}
                        <span className="item">
                          {" "}
                          In stock <i className="fa fa-shopping-basket" />
                        </span>
                      </p>
                      <p>
                        Product code: <span className="item">0405689</span>{" "}
                      </p>
                      <p>
                        Brand: <span className="item">Lee</span>
                      </p>
                      <p>
                        Product tags:&nbsp;&nbsp;
                        <span className="badge badge-success light me-1">
                          bags
                        </span>
                        <span className="badge badge-danger light me-1">
                          clothes
                        </span>
                        <span className="badge badge-warning light me-1">
                          shoes
                        </span>
                        <span className="badge badge-info light me-1">
                          dresses
                        </span>
                      </p>
                      <p className="text-content">
                        There are many variations of passages of Lorem Ipsum
                        available, but the majority have suffered alteration in
                        some form, by injected humour, or randomised words which
                        don't look even slightly believable. If you are going to
                        use a passage of Lorem Ipsum, you need to be sure there
                        isn't anything embarrassing.
                      </p>
                      <div className="d-flex align-items-end flex-wrap mt-4">
                        <div className="filtaring-area me-3">
                          <div className="size-filter">
                            <h4 className="m-b-15">Select size</h4>
                            <div className="btn-group mb-sm-0 mb-2 invisible-main" data-toggle="buttons">
                              <label 
                                //className=""
                                className={`btn btn-outline-primary mb-0  ${active === '1' ? 'active' : ''}`}  onClick={()=>setActive('1')}
                              >
                                <input type="radio" className="position-absolute invisible"  />{" "}
                                XS
                              </label>
                              <label 
                                className={`btn btn-outline-primary mb-0 ${active === '2' ? 'active' : ''}`}  onClick={()=>setActive('2')}
                              >
                                <input type="radio" className="position-absolute invisible "   />
                                SM
                              </label>
                              <label className={`btn btn-outline-primary mb-0 ${active === '3' ? 'active' : ''}`}  onClick={()=>setActive('3')}>
                                <input type="radio" className="position-absolute invisible "   />{" "}
                                MD
                              </label>
                              <label className={`btn btn-outline-primary mb-0 ${active === '4' ? 'active' : ''}`}  onClick={()=>setActive('4')}>
                                <input type="radio" className={`position-absolute invisible ${active === '4' ? 'active': ''}`}  />{" "}
                                LG
                              </label>
                              <label className={`btn btn-outline-primary mb-0 ${active === '5' ? 'active' : ''}`}  onClick={()=>setActive('5')}>
                                <input type="radio" className="position-absolute invisible "  />{" "}XL
                              </label>
                            </div>
                          </div>
                        </div>
                        {/*Quantity start*/}
                        <div className="col-2 px-0  me-3">
                          <input type="number" name="num" className="form-control input-btn input-number" defaultValue={1}/>
                        </div>
                        {/*Quanatity End*/}
                        <div className="shopping-cart me-3">
                          <Link className="btn btn-primary mt-2" to="#">
                            <i className="fa fa-shopping-basket me-2" />
                            Add to cart
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* review */}
        <Modal show={reviewToggle} className="modal fade" id="reviewModal" centered>
          <>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Review</h5>
                <button
                  type="button"
                  onClick={() => setReviewToggle(false)}
                  className="btn-close"
                  data-dismiss="modal"
                >
                  {/* <span>×</span> */}
                </button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setReviewToggle(false);
                  }}
                >
                  <div className="text-center mb-4">
                    <img
                      className="img-fluid rounded"
                      width={78}
                      src={avater1}
                      alt="DexignZone"
                    />
                  </div>
                  <div className="form-group">
                    <div className="rating-widget mb-4 text-center">
                      {/* Rating Stars Box */}
                      <div className="rating-stars">
                        <ul
                          id="stars"
                          className="d-flex justify-content-center align-items-center"
                        >
                          <li className="star" title="Poor" data-value={1}>
                            <i className="fa fa-star fa-fw" />
                          </li>
                          <li className="star" title="Fair" data-value={2}>
                            <i className="fa fa-star fa-fw" />
                          </li>
                          <li className="star" title="Good" data-value={3}>
                            <i className="fa fa-star fa-fw" />
                          </li>
                          <li className="star" title="Excellent" data-value={4}>
                            <i className="fa fa-star fa-fw" />
                          </li>
                          <li className="star" title="WOW!!!" data-value={5}>
                            <i className="fa fa-star fa-fw" />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      placeholder="Comment"
                      rows={5}
                      defaultValue={""}
                    />
                  </div>
                  <button className="btn btn-success btn-block">RATE</button>
                </form>
              </div>
            </div>
          </>
        </Modal>
      </div>
    </>
  );
};

export default ProductDetail;
