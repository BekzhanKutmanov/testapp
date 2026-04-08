export const getShortName = (fullName: string) => {
  const [lastName, firstName, middleName] = fullName.split(' ')

  return `${lastName}.${firstName?.[0] || ''}${middleName?.[0] ? `.${middleName?.[0]}` : ''}`
}
