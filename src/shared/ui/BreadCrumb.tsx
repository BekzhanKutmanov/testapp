'use client';

import { type BreadCrumbType } from '@/shared/model/types/BreadCrumbType'
import Link from 'next/link'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { usePathname } from 'next/navigation'

export default function BreadCrumb({breadCrumbList}: {breadCrumbList: BreadCrumbType[]}) {
  const pathname = usePathname();

  const textContent = (item: BreadCrumbType)=> {
    if(item?.href === pathname){
      return <b className={'text-sm'}>{item?.label}</b>
    } else {
      return <Link className={'text-blue-500 text-sm hover:text-blue-800 transition-colors'} href={item?.href}>{item?.label}</Link>
    }
  }

  return (
    <div className={'flex pb-3'}>
      {
        breadCrumbList?.map((item, idx: number)=> {
          return (
            <div key={item?.label + idx} className={'flex items-center'}>
              {idx !== 0 && (
                <ArrowForwardIosIcon
                  color="primary"
                  className="text-[11px] mx-1"
                />
              )}

              {textContent(item)}
            </div>
          )
        })
      }
    </div>
  );
}
