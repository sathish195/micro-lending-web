import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import "../../../node_modules/swiper/swiper.css"
import "../../../node_modules/swiper/modules/navigation.css";
import "../../../node_modules/swiper/modules/pagination.css";
import "../../../node_modules/swiper/modules/scrollbar.css";

const Faqs = () => {
  return (
    <section className='resources_section bg-primary-gradient' id='Resources'>
        <div className='container'>
            <h5 className='fw-bold mb-1 text-white'>What makes us special ?</h5>
            <p className='fw-normal fs-14 mb-2 text-white-50'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, cupiditate.</p>
            <Link className='text-success text-decoration-underline fw-bold'>Know more <i className="ri-arrow-right-up-line align-middle"></i></Link>
            <Swiper className='pt-5'
            breakpoints={
                {
                0: {
                slidesPerView: 1,
                },
                400: {
                slidesPerView: 2,
                },
                639: {
                slidesPerView: 3,
                },
                865: {
                slidesPerView: 3
                },
                992: {
                slidesPerView: 3
                },
                1200: {
                slidesPerView: 4
                },
            }}
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={15}
            slidesPerView={4}
            navigation
            pagination={{ clickable: true }}
            >
                <SwiperSlide>
                    <div className='card shadow-none  rounded-3 '>
                        <div className='card-body'>
                           <div className='icon mb-3 bg-primary-gradient'>
                                <i className="ri-refund-2-line"></i>
                           </div>
                            <h6 className='fw-bold mb-4'>Monthly interest credits on your Savings Account</h6>
                            <Link>Read more <i className="ri-arrow-right-s-line align-middle"></i></Link>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='card shadow-none  rounded-3 '>
                        <div className='card-body'>
                           <div className='icon mb-3 bg-secondary-gradient'>
                                <i className="ri-exchange-funds-line"></i>
                           </div>
                            <h6 className='fw-bold mb-4'>ZERO charges on non-home branch transactions</h6>
                            <Link>Read more <i className="ri-arrow-right-s-line align-middle"></i></Link>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='card shadow-none  rounded-3 '>
                        <div className='card-body'>
                           <div className='icon mb-3 bg-info-gradient'>
                                <i className="ri-save-line"></i>
                           </div>
                            <h6 className='fw-bold mb-4'>Up to 7% interest p.a. on Savings Accounts</h6>
                            <Link>Read more <i className="ri-arrow-right-s-line align-middle"></i></Link>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='card shadow-none  rounded-3 '>
                        <div className='card-body'>
                           <div className='icon mb-3 bg-danger-gradient'>
                                <i className="ri-refund-line"></i>
                           </div>
                            <h6 className='fw-bold mb-4'>ZERO charges on services like NEFT & ATM transactions</h6>
                            <Link>Read more <i className="ri-arrow-right-s-line align-middle"></i></Link>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='card shadow-none  rounded-3 '>
                        <div className='card-body'>
                           <div className='icon mb-3 bg-warning-gradient'>
                                <i className="ri-refund-2-line"></i>
                           </div>
                            <h6 className='fw-bold mb-4'>ZERO charges on services like NEFT & ATM transactions</h6>
                            <Link>Read more <i className="ri-arrow-right-s-line align-middle"></i></Link>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='card shadow-none  rounded-3 '>
                        <div className='card-body'>
                           <div className='icon mb-3 bg-success-gradient'>
                                <i className="ri-refund-2-line"></i>
                           </div>
                            <h6 className='fw-bold mb-4'>ZERO charges on services like NEFT & ATM transactions</h6>
                            <Link>Read more <i className="ri-arrow-right-s-line align-middle"></i></Link>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    </section>
  )
}

export default Faqs
