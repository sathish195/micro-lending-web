import React from 'react';

const Home = () => {
    return (
        <section className='home_section' id='home'>
            <div className='container'>
                <div className='row'>
                    <div className='col-xl-6 col-lg-6 my-auto'>
                        <div className='mt-md-5'>
                            <div className='highlight-line mb-4'></div>
                            <h1 className='main_home_text mb-4'>Get a home <br /> loan the <br /> smart Way with <span className='text-primary'>Micro !</span></h1>
                            <p className='mb-4 fw-normal'>Welcome to Micro Lending – your passport to unparalleled financial adventures in the captivating realm of the Philippines! Brace yourself for an exhilarating journey where currency management meets market mastery, tailored exclusively for the bold and the savvy.
                                Step into a world where every exchange is seamless, every investment opportunity is electrifying, and every financial dream is within reach. From intrepid globetrotters seeking effortless currency swaps to astute investors hungry for lucrative ventures, our platform is the beacon guiding you through the thrilling twists and turns of the Philippine financial landscape.
                                Get ready to embark on an odyssey of financial empowerment, where innovation meets intuition and possibilities are boundless. Welcome to Micro Lending – where your financial aspirations take flight!</p>
                            <button className="btn btn-primary btn-lg px-4 rounded-pill">Read More <i className="ri-arrow-right-line animate-pulse"></i></button>
                        </div>
                    </div>
                    <div className='col-xl-6 col-lg-6 text-sm-center'>
                        <img src="assets/images/landing/section1/7.png" alt='img' className='home_image mt-3 mt-md-0' />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Home
