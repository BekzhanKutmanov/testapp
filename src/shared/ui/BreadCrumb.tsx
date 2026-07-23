'use client';

import { type BreadCrumbType } from '@/shared/model/types/BreadCrumbType'
import Link from 'next/link'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { buildBreadcrumbs } from '@/shared/lib/breadcrumbs/buildBreadcrumbs'

export default function BreadCrumb() {
  const pathname = usePathname();

  const [breadCrumb, setBreadCrumb] = useState<BreadCrumbType[] | null>(null);

  const textContent = (item: BreadCrumbType)=> {
    if(item?.href === pathname){
      return <b className={'text-sm'}>{item?.label}</b>
    } else {
      return <Link className={'text-blue-500 text-sm hover:text-blue-800 transition-colors'} href={item?.href}>{item?.label}</Link>
    }
  }

  useEffect(()=> {
    const processingBreadCrumb = buildBreadcrumbs(pathname);
    console.log( processingBreadCrumb)
    if( processingBreadCrumb && Array.isArray( processingBreadCrumb)) {
      setBreadCrumb( processingBreadCrumb);
    }
  },[]);

  return (
    <div className={'flex pb-3 flex-wrap'}>
      {
        breadCrumb?.map((item, idx: number)=> {
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
