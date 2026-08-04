'use client'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import { MenuItem } from '@menu/vertical-menu'
import { useDroppable } from '@dnd-kit/core'
import ActionsMenu from '@/shared/ui/components/ActionsMenu'
import { useDndUi } from '@/shared/api/TeacherDndProvider'

interface MenuItemType {
  data: SubjectType[]
  onUpdate: (id: number) => void
  onDelete: (id: number) => void
}

function SubjectDroppable({
  item,
  onUpdate,
  onDelete
}: {
  item: SubjectType
  onUpdate: (id: number) => void
  onDelete: (id: number) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: item.id });
  const { isDragging } = useDndUi();

  return (
    <div
      ref={setNodeRef}
      className={`
        flex items-center justify-between rounded-md
        transition-all duration-200
        ${isDragging ? 'border-b-2 border-b-blue-400 bg-blue-50/40' : ''}
        ${isOver ? 'ring-2 ring-blue-500 bg-blue-100 scale-[1.02]' : ''}
      `}
    >
      <MenuItem href={`/teacher/${item.id}`}>
        <span className='max-w-[170px] text-nowrap overflow-hidden text-ellipsis block' title={item.name}>
          {item.name}
        </span>
      </MenuItem>

      <ActionsMenu icon={''} onClose={() => {}} onOpen={() => {}}>
        <div className='flex justify-center w-full p-3 cursor-pointer hover:bg-gray-100'>
          <EditIcon fontSize='small' onClick={() => onUpdate(item.id)} style={{ fontSize: '16px' }} />
        </div>

        <div className='flex justify-center w-full p-3 cursor-pointer hover:bg-gray-100'>
          <DeleteIcon fontSize='small' onClick={() => onDelete(item.id)} style={{ fontSize: '16px' }} />
        </div>
      </ActionsMenu>
    </div>
  )
}

export default function NavigationSubjects({ data, onUpdate, onDelete }: MenuItemType) {
  return (
    <>
      {data?.map(item => (
        <SubjectDroppable key={item.id} item={item} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </>
  )
}
