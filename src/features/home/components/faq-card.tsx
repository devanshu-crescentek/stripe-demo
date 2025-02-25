import React from 'react'

const FaqCard = () => {
  return (
    <div className={`bg-[#F3F2F1] md:py-16 sm:py-10 py-9`}>
      {' '}
      <div className='container w-full mx-auto px-4 sm:px-6 lg:gap-12'>
        <h2
          className={`md:text-[40px] text-[30px] font-semibold md:leading-[30px] leading-[35px]
         max-w-3xl`}
        >
          Frequently Asked Questions
        </h2>
        <h3 className='mt-[30px] font-semibold md:text-[30px] text-[20px] leading-[25px]'>
          Do I need to own the property to be able to search?
        </h3>
        <p className='mt-[15px] font-normal leading-[30px] md:text-[20px] text-[16px] max-w-3xl'>
          The answer is no. You can search for any property in England and
          Wales. You can search for any property, you do not have to own the
          property.
        </p>
        <h3 className='mt-[30px] font-semibold md:text-[30px] text-[20px] leading-[25px]'>
          What is a filed plan?
        </h3>
        <p className='mt-[15px] font-normal leading-[30px] md:text-[20px] text-[16px] max-w-3xl'>
          A filed plan is another name for the Title Plan. The title plan
          provides a visual representation and identifies the extent of the land
          in a registered title.
        </p>
        <h3 className='mt-[30px] font-semibold md:text-[30px] text-[20px] md:leading-[50px] leading-[30px] max-w-3xl'>
          I haven’t received the emailed documents. What should I do?
        </h3>
        <p className='mt-[15px] font-normal leading-[30px] md:text-[20px] text-[16px] max-w-3xl'>
          Your emailed documents should arrive within 24 UK business hours.
          Please check your junk/spam folder if you do not see them in your
          inbox. If more than 24 UK business hours have passed and you still
          haven’t received our email, please email us at <br className='block md:hidden'/>
          <a href="mailto:info@uklandregistryonline.org.uk" className='text-[#28A745] no-underline'>info@uklandregistryonline.org.uk</a>
        </p>
      </div>
    </div>
  )
}

export default FaqCard
