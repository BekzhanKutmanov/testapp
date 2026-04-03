'use client';

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import { MenuItem } from '@menu/vertical-menu'


import ActionsMenu from '@/shared/ui/components/ActionsMenu'

interface MenuItemType {
  name: string,
  id:number
}

export default function NavigationSubjects ({data, onUpdate}: MenuItemType){

  console.log(data)
  return data?.map((item: {id: number, name: string}) => {
      return <div key={item?.id} className={'flex items-center'}>
        <MenuItem
          href={`/teacher/${item?.id}`}
        >
          <span className={'max-w-[160px] text-nowrap overflow-hidden text-ellipsis block'}>{item?.name}</span>
        </MenuItem>
        <ActionsMenu>
          <MenuItem onClick={() => onUpdate(item?.id)}>
            <EditIcon fontSize="small" style={{ marginRight: 8 }} />
            Редактировать
          </MenuItem>

          <MenuItem onClick={() => console.log('delete')}>
            <DeleteIcon fontSize="small" style={{ marginRight: 8 }} />
            Удалить
          </MenuItem>
        </ActionsMenu>
      </div>
    })
}
