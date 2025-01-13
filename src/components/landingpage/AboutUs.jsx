import React from 'react'

const AboutUs = () => {
    return (
        <section className='about_section' id='About'>
            <div className='container'>
                <div className='row py-md-5'>
                    <div className='col-xl-6 col-lg-6 text-lg-start text-center'>
                        <img src='assets/images/landing/aboutus/1.png' alt='img' className='about_image mb-4 mb-md-0' />
                    </div>
                    <div className='col-xl-6 col-lg-6 my-auto'>
                        <h5 className='fw-bold aboutus-text mb-2 mb-md-4'>About us</h5>
                        <p className='fw-normal fs-15 mb-2'>We are committed to empowering individuals and businesses to navigate the currency exchange and investment landscape of the Philippines with confidence and ease.</p>
                        <p className='fw-normal fs-15 mb-4'> Whether you’re a seasoned investor or new to the world of finance, our platform provides the tools and resources you need to achieve your financial goals. Join us today and experience the difference of a trusted partner in your financial journey.</p>
                        <button className='btn btn-lg px-3 rounded-pill bg-primary-gradient text-white'>Get started</button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutUs
