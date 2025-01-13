import React from 'react'

const ContactUs = () => {
  return (
    <div>
        <section className='contact_us' id='' >
            <div className='container py-3'>
                <div className='row'>
                    <div className='col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 mb-3 mb-sm-0'>
                        <div className='d-flex align-items-center justify-content-lg-center'>
                            <div className='icon'>
                                <i className="ri-file-list-3-line"></i>
                            </div>
                            <p className='mb-0 text-primary fw-bold ms-3 fs-16'>Give a complaint</p>
                        </div>
                    </div>
                    <div className='col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 mb-3 mb-sm-0'>
                        <div className='d-flex align-items-center justify-content-lg-center'>
                            <div className='icon'>
                                <i className="ri-phone-line"></i>
                            </div>
                            <p className='mb-0 text-primary fw-bold ms-3 fs-16'>Customer Support</p>
                        </div>
                    </div>
                    <div className='col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12'>
                        <div className='d-flex align-items-center justify-content-lg-center'>
                            <div className='icon'>
                                <i className="ri-road-map-line"></i>
                            </div>
                            <p className='mb-0 text-primary fw-bold ms-3 fs-16'>Navigate nearest branch</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
  )
}

export default ContactUs
