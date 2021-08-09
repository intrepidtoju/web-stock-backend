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

export async function login({ email, password }) {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) throw Error('Email not found');
    if (!user.authenticate(password)) throw Error('Invalid password');

    return {
      message: 'User logged in',
      data: user.getAuthJSON(),
      success: true,
    };
  } catch (error) {
    throw error;
  }
}
