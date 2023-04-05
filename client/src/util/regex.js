const  mailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

export const isEmailValid = (email) => {
  return email.match(mailRegex)
}
