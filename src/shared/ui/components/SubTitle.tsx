interface SubTitleType {
  title: string
}

export default function SubTitle({ title }: SubTitleType) {
  return <h2 className={'text-xl sm:text-2xl pb-2 font-bold'}>{title}</h2>
}
