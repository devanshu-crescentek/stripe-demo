import Link from 'next/link'

const Footer = () => {
  return (
    <footer className='bg-[#F3F2F1] border-t border-[#B1B4B6] py-[40px]'>
      <div className='container w-full mx-auto px-4 sm:px-6 flex flex-shrink sm:items-start items-center sm:justify-start justify-center flex-grow gap-8 text-gray-800'>
        {/* Left Section */}
        <div className='sm:flex flex-col flex-wrap w-[25%] hidden'>
          <Link href='/' className='pb-2 text-[16px] font-normal'>
            Home
          </Link>

          <Link href='/' className='pb-2 text-[16px] font-normal'>
            Title Document
          </Link>
          <Link href='#' className='pb-2 text-[16px] font-normal'>
            Title Deed
          </Link>
          <Link href='#' className='pb-2 text-[16px] font-normal'>
            Conveyancing Pack
          </Link>
        </div>

        {/* Center Section */}
        <div className='flex flex-col items-center sm:w-[50%] w-full'>
          <div className='sm:mb-[20px] mb-0'>
            <a href='https://uklandregistryonline.org.uk/'>
              <img
                src='/Group-11.png'
                alt='Land Registry'
                className='h-[54px] w-[244px]'
              />
            </a>
          </div>
          <div className='w-[332px] text-center leading-[30px] sm:text-[11px] text-[15px]'>
            <div className='mt-[20px]'>
              UK Land Registry Online is an independent entity and is not
              affiliated with or operated by the UK Government.
            </div>
          </div>
          <div className='mt-[20px] mb-[20px]'>
            <img
              src='/image-6.png'
              alt='Payment Methods'
              className='h-[61px] w-[188px]'
            />
          </div>
          <div className='text-center text-[#1E1E1E] text-[14px] leading-[30px] hidden sm:block'>
            <p>
              2025 © Copyright –{' '}
              <a
                className='text-black'
                href='https://uklandregistryonline.org.uk'
              >
                uklandregistryonline.org.uk
              </a>
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className='sm:flex flex-col flex-wrap items-end text-center w-[25%] hidden'>
          <Link
            href='/privacy-policy'
            className='pb-2 text-[16px] font-normal text-center flex items-center'
          >
            Privacy Policy
          </Link>
          <Link
            href='/cookies-policy'
            className='pb-2 text-[16px] font-normal text-center flex items-center'
          >
            Cookies Policy
          </Link>
          <Link
            href='/terms-conditions'
            className='pb-2 text-[16px] font-normal text-center flex items-center'
          >
            Terms & Conditions
          </Link>
        </div>
      </div>
      <div className='container w-full mx-auto px-4 sm:px-6 flex sm:hidden items-center justify-between gap-8 text-gray-800 mb-4'>
        <div className='flex flex-col flex-wrap w-[50%]'>
          <Link href='/' className='pb-2 text-[16px] font-normal'>
            Home
          </Link>
          <Link href='/' className='pb-2 text-[16px] font-normal'>
            Title Document
          </Link>
          <Link href='/faq' className='pb-2 text-[16px] font-normal'>
            FAQ
          </Link>
        </div>
        <div className='flex flex-col flex-wrap items-end text-center w-[50%]'>
          <Link
             href='/privacy-policy'
            className='pb-2 text-[16px] font-normal text-center flex items-center'
          >
            Privacy Policy
          </Link>
          <Link
           href='/cookies-policy'
            className='pb-2 text-[16px] font-normal text-center flex items-center'
          >
            Cookies Policy
          </Link>
          <Link
            href='/terms-conditions'
            className='pb-2 text-[16px] font-normal text-center flex items-center'
          >
            Terms & Conditions
          </Link>
        </div>
      </div>
      <div className='container w-full mx-auto px-4 sm:px-6 flex sm:hidden items-center justify-center gap-8 text-gray-800'>
        <div className='text-center text-[#1E1E1E] text-[14px] leading-[30px]'>
          <p>
            2025 © Copyright –{' '}
            <a
              className='text-black'
              href='https://uklandregistryonline.org.uk'
            >
              uklandregistryonline.org.uk
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
