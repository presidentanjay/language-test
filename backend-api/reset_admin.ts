import User from '#models/user'

export default async function run() {
  const user = await User.findBy('email', 'admin@gmail.com')
  if (user) {
    user.password = 'password'
    await user.save()
    console.log('Admin password successfully reset to "password"')
  } else {
    console.log('Admin user not found')
  }
}
