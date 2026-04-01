interface MainTitleType {
  title: string
}

export default function MainTitle({ title }: MainTitleType) {
  return <h2 className={'text-2xl sm:text-3xl pb-2 font-bold'}>{title}</h2>
}
