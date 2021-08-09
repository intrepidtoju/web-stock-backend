import User from './model';
export async function create(body) {
  try {
    const { email } = body;
    const findUserWithSameEmail = await User.findOne({ where: { email } });
    if (findUserWithSameEmail) {
      throw Error('Emaul already exist');
    }
    // Create user detail
    await User.create(body);
    return {
      message: 'User created. Kindly check your email to verify',
    };
  } catch (error) {
    throw error;
  }
}
