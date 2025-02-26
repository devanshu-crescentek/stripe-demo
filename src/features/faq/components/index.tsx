'use client'
import { useState } from 'react'

import { PlusIcon, MinusIcon } from 'lucide-react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion'

import { cn } from '@/lib/utils'
import { faq } from '@/features/faq/lib/constants'

const FAQ = () => {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (value: string) => {
    setOpenItems((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    )
  }

  return (
    <div className='h-fit flex items-center justify-center px-6 py-12'>
      <div className='w-full container max-w-6xl px-4 sm:px-6'>
        <h2 className='text-4xl md:text-[40px] !leading-[52px] font-semibold text-center'>
          FAQ
        </h2>

        <Accordion type='multiple' className='mt-8 space-y-4 px'>
          {faq.map(({ question, answer }, index) => {
            const value = `question-${index}`
            const isOpen = openItems.includes(value)
            return (
              <AccordionItem
                key={question}
                value={value}
                className='bg-accent md:py-1 py-0 md:px-1 px-0 border-[3px] border-[#000]'
              >
                <AccordionPrimitive.Header className='flex'>
                  <AccordionPrimitive.Trigger
                    onClick={() => toggleItem(value)}
                    className={cn(
                      'flex flex-1 md:px-[35px] px-[15px] items-center justify-between py-4 md:text-[30px] text-[20px] font-extrabold md:leading-[1.2em] leading-[24px] tracking-[-0.45px] uppercase transition-all',
                      'text-start md:text-[30px] text-[20px] md:leading-[1.2em] leading-[24px]'
                    )}
                  >
                    {question}
                    {isOpen ? (
                      <MinusIcon className='h-[1em] w-[1em] shrink-0 transition-transform duration-200' />
                    ) : (
                      <PlusIcon className='h-[1em] w-[1em] shrink-0 transition-transform duration-200' />
                    )}
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent className='md:px-[35px] px-[15px] leading-[1.2em] font-normal text-[18px] text-black'>
                  {answer}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </div>
  )
}

export default FAQ
