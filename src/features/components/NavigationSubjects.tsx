'use client'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import { MenuItem } from '@menu/vertical-menu'

import ActionsMenu from '@/shared/ui/components/ActionsMenu'

interface MenuItemType {
  data: SubjectType[],
  onUpdate: (id: number)=> void,
  onDelete: (id: number)=> void,
}

export default function NavigationSubjects({ data, onUpdate, onDelete }: MenuItemType) {
  return data?.map((item: { id: number; name: string }) => {
    return (
      <div key={item?.id} className={'flex items-center justify-between'} onBlur={()=> console.log("i")} onDragOver={(e) => e.preventDefault()}
           onDrop={()=> console.log(item)}>
        <MenuItem href={`/teacher/${item?.id}`}>
          <span className={'max-w-[170px] text-nowrap overflow-hidden text-ellipsis block'} title={item?.name}>
            {item?.name}
          </span>
        </MenuItem>

        <ActionsMenu icon={''} onClose={() => {}} onOpen={() => {}}>
          <div className={'flex justify-center w-full p-3 cursor-pointer hover:bg-gray-100'}>
            <EditIcon fontSize='small' onClick={() => onUpdate(item?.id)} style={{fontSize: '16px'}} />
          </div>
          {/*<span>Редактировать</span>*/}

          <div className={'flex justify-center w-full p-3 cursor-pointer hover:bg-gray-100'}>
            <DeleteIcon fontSize='small' onClick={() => onDelete(item?.id)} style={{fontSize: '16px'}} />
            {/*<span>Удалить</span>*/}
          </div>
        </ActionsMenu>
      </div>
    )
  })
}
