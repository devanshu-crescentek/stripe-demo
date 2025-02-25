import DocCard from './doc-card'
import FaqCard from './faq-card'

const Home = () => {
  return (
    <div className='h-full'>
      <div className='md:py-16 sm:py-10 py-9 bg-white'>
        <div className='container w-full mx-auto px-4 sm:px-6 lg:gap-12'>
          <div className='bg-[#F3F2F1] rounded-lg text-start max-w-3xl min-h-[129px] flex justify-center items-center p-[20px]'>
            <p className='md:text-[20px] text-[16px] md:leading-[30px] leading-[25px] font-semibold'>
              Find information and access official electronic copies of title
              deeds and documents for over 28 million properties in England,
              Wales & Scotland.
            </p>
          </div>
          <h2 className='md:text-[40px] text-[30px] font-semibold leading-[30px] md:mb-10 mb-2 mt-10'>
            Search by Postcode
          </h2>
          <div className='md:mt-10 mt-4 w-full max-w-sm'>
            {/* Input Box */}
            <input
              type='text'
              placeholder='Enter your postcode here ....'
              className='mt-4 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-4'
            />

            {/* Help Link */}
            <p className='mt-2 text-[#0d6efd] text-[12px] font-bold mb-6'>
              <a href='#' className='underline'>
                Don’t know the Postcode? Enter the address manually &gt;&gt;
              </a>
            </p>

            {/* Search Button */}
            <button className='mt-4 w-full bg-green-600 text-[18px] h-[58px] text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2 hover:bg-green-700'>
              Search Title Documents
              <span>&#8594;</span>
            </button>

            <p className='mt-[15px] mb-[1.6em] text-[16px] text-gray-600'>
              By using this service, you agree to the
              <a href='#' className='text-green-600 mx-1'>
                terms of service
              </a>
              and
              <a href='#' className='text-green-600 mx-1'>
                privacy policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
      <DocCard
        cardBgColor='bg-[#F3F2F1]'
        cardTitle='Title Register Deeds'
        cardDes='The Title Register provides all the official particulars relating to ownership of a property, a physical description of the property and restrictive covenants in a written form.'
        pointInfo={[
          {
            title: 'Deeds - Title Register Documents',
            des: 'Displays property or land ownership descriptions, and any available restrictive covenants. We also recommend purchasing the Title Plan,which visually indicates the extent of the registered land.',
          },
        ]}
        btnTitle='Get Title Register Now'
      />
      <DocCard
        cardBgColor='bg-white'
        cardTitle='Title Plan Deeds'
        cardDes='The Title Plan offers a visual representation, outlining the land’s extent within a registered title. It may also include additional plan references to help identify various parts of the land.'
        pointInfo={[
          {
            title: 'Deeds - Title Plan Documents',
            des: 'Visual depiction of property or land within a registered title. We also recommend purchasing the Title Register, which provides a detailed description of the plan.',
          },
        ]}
        btnTitle='Get Title Plan Now'
      />
      <DocCard
        cardBgColor='bg-[#F3F2F1]'
        cardTitle='Conveyancing Pack'
        cardDes='The pack contains all available; Lease Deeds, Transfer Deeds, Conveyancing Deeds and Charge (Mortgage) documents available for the selected property or land.'
        btnTitle='Get Conveyance Plan Now'
      />
      <DocCard
        cardBgColor='bg-white'
        cardTitle='Access Land Registry'
        cardDes='Our online Land Registry services are available 24/7 to everyone, including commercial and public organizations as well as individuals. Easily request property and land title deeds through our website and we’ll email electronic copies of the title deed documents to you the same day.'
        cardSubDes='You can also access the Land Registry Title Register and Title Plan on our site, which provide comprehensive details including property boundaries, owner information, a physical description of the property, and specifics like restrictive covenants and easements.'
        btnTitle='Access Registry Documents Now'
      />
      <DocCard
        cardBgColor='bg-[#F3F2F1]'
        cardTitle='What Are Title Documents?'
        cardDes='The Title Plan may show features (such as parts of the land coloured differently, or edged in various colours) with no explanation on the plan itself, it is therefore often difficult to determine the full extent of the Title deeds. These features will always be explained in the Title Register document.'
        cardSubDes='Such features would usually relate to areas over which the property has a right of way, or areas of land that may have been removed from the Title Plan. We would, therefore, recommend that you purchase the Title Plan & Register at the same time.'
        btnTitle='Get title Documents Now'
      />
      <DocCard
        cardBgColor='bg-white'
        cardTitle='Access Land Registry Documents Online in 3 Quick and Easy Steps.'
        titleLeading
        cardDes='Access Land Registry documents online in three straightforward steps: First navigate to the ‘Documents’ section. Then, enter the necessary property details and submit your request. The documents will be promptly emailed to you.'
        pointInfo={[
          {
            title: 'Select Your Documents',
            des: 'Purchase Title Plan & Title Register Official Documents.',
          },
          {
            title: 'Complete The Form',
            des: 'Enter the details of the property and make payment.',
          },
          {
            title: 'Access Your Documents',
            des: 'We will process your documents and send them to you via email.',
          },
        ]}
        btnTitle='Get Land Registry Documents'
      />
      <FaqCard/>
    </div>
  )
}

export default Home
