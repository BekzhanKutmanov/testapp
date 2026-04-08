interface MainTitleType {
  title: string
}

export default function MainTitle({ title }: MainTitleType) {
  return <h2 className={'text-xl sm:text-2xl pb-2 font-bold'}>{title}</h2>
}
