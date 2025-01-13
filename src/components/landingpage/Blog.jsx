import React from 'react'
import { Link } from 'react-router-dom'

const Blog = () => {
  return (
    <section className='blog_section' id='Clients'>
        <div className='container'>
            <h5 className='fw-bold text-center main_title_text'>Our Blogs</h5>
            <div className='text-center fw-normal mb-5 info_text'>Our intuitive interface makes the loan application process seamless and straightforward.</div>
            <div className='row justify-content-center pb-md-4'>
                <div className='col-xl-4 col-sm-12 col-lg-4 col-12 col-md-4'>
                    <div className='card mb-3 mb-md-0'>
                        <img src='assets/images/landing/blog/1.png' alt='img' className='card-img-top ' />
                        <div className='card-body'>
                            <h6 className="card-title fw-bold">Micro loan approval.</h6>
                            <p className='mb-3 fw-normal mb-3'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis id fugit eveniet dolore voluptas perferendis, ad pariatur quia autem quasi blanditiis expedita asperiores voluptatibus dolorem magni, dicta incidunt sed eius.</p>
                            <Link className='btn bg-primary-light'>View more</Link>
                        </div>
                    </div>
                </div>
                <div className='col-xl-4 col-sm-12 col-lg-4 col-12 col-md-4'>
                    <div className='card mb-3 mb-md-0'>
                        <img src='assets/images/landing/blog/2.png' alt='img' className='card-img-top' />
                        <div className='card-body'>
                            <h6 className="card-title fw-bold">Micro loan approval.</h6>
                            <p className='mb-3 fw-normal mb-3'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis id fugit eveniet dolore voluptas perferendis, ad pariatur quia autem quasi blanditiis expedita asperiores voluptatibus dolorem magni, dicta incidunt sed eius.</p>
                            <Link className='btn bg-primary-light'>View more</Link>
                        </div>
                    </div>
                </div>
                <div className='col-xl-4 col-sm-12 col-lg-4 col-12 col-md-4'>
                    <div className='card mb-3 mb-md-0'>
                        <img src='assets/images/landing/blog/3.png' alt='img' className='card-img-top' />
                        <div className='card-body'>
                            <h6 className="card-title fw-bold">Micro loan approval.</h6>
                            <p className='mb-3 fw-normal mb-3'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis id fugit eveniet dolore voluptas perferendis, ad pariatur quia autem quasi blanditiis expedita asperiores voluptatibus dolorem magni, dicta incidunt sed eius.</p>
                            <Link className='btn bg-primary-light'>View more</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Blog
