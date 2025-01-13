import React from 'react'

const Loans = () => {
  return (
    <section className='loans_section' id='Solutions'>
        <div className='container'>
            <h5 className='fw-bold main_title_text text-center'>Features</h5>
            <div className='text-center fw-normal info_text mb-5'>Our intuitive interface makes the loan application process seamless and straightforward.</div>
            <div className='row'>
                <div className='col-xl-3 col-lg-6 col-sm-6 col-12'>
                    <div className='card shadow-none feature-cards border bg-primary-gradient text-white rounded-4'>
                        <div className='card-body'>
                            <p>Personal Loans</p>
                            <h5 className='fw-bold mb-3'>Get a credit line up to &#8377;12 lakh</h5>
                            <button className='btn btn-lg px-3 btn btn-outline-light rounded-2'>Apply Now</button>
                        </div>
                    </div>
                </div>
                <div className='col-xl-3 col-lg-6 col-sm-6 col-12'>
                    <div className='card shadow-none feature-cards border bg-secondary-gradient text-white rounded-4'>
                        <div className='card-body'>
                            <p>Fixed Deposite</p>
                            <h5 className='fw-bold mb-3'>Earn up to with the 8.75% p.a.</h5>
                            <button className='btn btn-lg px-3 btn btn-outline-light rounded-2'>Apply Now</button>
                        </div>
                    </div>
                </div>
                <div className='col-xl-3 col-lg-6 col-sm-6 col-12'>
                    <div className='card shadow-none feature-cards border bg-info-gradient text-white rounded-4'>
                        <div className='card-body'>
                            <p>Credit Cards</p>
                            <h5 className='fw-bold mb-3'>Get the Power of UPI - on Micro Credit Cards</h5>
                            <button className='btn btn-lg px-3 btn btn-outline-light rounded-2'>Apply Now</button>
                        </div>
                    </div>
                </div>
                <div className='col-xl-3 col-lg-6 col-sm-6 col-12'>
                    <div className='card shadow-none feature-cards border bg-danger-gradient text-white rounded-4'>
                        <div className='card-body'>
                            <p>Customer Durable Loan</p>
                            <h5 className='fw-bold mb-3'>Enjoy instant approval on loans of up to ₹8 lakhs</h5>
                            <button className='btn btn-lg px-3 btn btn-outline-light rounded-2'>Apply Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Loans
