import React from 'react'

const DocCard = ({
  cardBgColor,
  cardTitle,
  cardDes,
  cardSubDes,
  pointInfo,
  btnTitle,
  titleLeading = false,
}: {
  cardBgColor: string
  cardTitle?: string
  cardDes?: string
  cardSubDes?: string
  pointInfo?: {
    title: string
    des: string
  }[]
  btnTitle?: string
  titleLeading?: boolean
}) => {
  return (
    <div className={`${cardBgColor} md:py-16 sm:py-10 py-9`}>
      <div className='container w-full mx-auto px-4 sm:px-6 lg:gap-12'>
        {' '}
        <h2
          className={`md:text-[40px] text-[30px] font-semibold ${titleLeading ? 'md:leading-[50px] leading-[35px]' : 'leading-[30px]'} max-w-3xl`}
        >
          {cardTitle}
        </h2>
        {cardDes && (
          <p className='md:text-[20px] text-[16px] leading-[30px] my-[30px] max-w-3xl'>
            {cardDes}{' '}
          </p>
        )}
        {cardSubDes && (
          <p className='text-[20px] leading-[30px] my-[30px] max-w-3xl'>
            {cardSubDes}{' '}
          </p>
        )}
        {pointInfo && pointInfo?.length > 0 && (
          <div className='mt-10'>
            <ul className='list-disc ml-6'>
              {pointInfo?.map((item, index) => (
                <li
                  key={index}
                  className='md:text-[20px] text-[16px] leading-[30px] font-semibold max-w-3xl md:mb-6 mb-4'
                >
                  {item.title}
                  <p className='md:mt-1 mt-0 md:text-[20px] text-[16px] leading-[30px] font-normal max-w-3xl'>
                    {item.des}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {btnTitle && (
          <button className='mt-6 w-fit p-[20px] h-[58px] md:text-[20px] text-[16px] bg-green-600  text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2 hover:bg-green-700'>
            {btnTitle}
            <span>&#8594;</span>
          </button>
        )}
      </div>{' '}
    </div>
  )
}

export default DocCard
