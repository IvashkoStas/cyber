import { alpha as a, email as e, helpers, minLength as m, maxValue as mv, required as r, sameAs } from '@vuelidate/validators';

const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?]).{8,}$/;

export const minAmount = {
  $validator: (amount: string) => Number(amount) > 19,
  $message: () => 'shared.labels.minAmount',
};

export const checkPassword = {
  $validator: (password: string) => passwordReg.test(password),
  $message: () => 'shared.labels.checkPassword',
};



export const protonServiceValidator = {
  $validator: (email: string) => !email.toLowerCase()?.includes('@proton.'),
  $message: () => 'shared.labels.protonServiceNotSupported',
};


export const validateDocumentDate = {
  $validator(value: string) {
    const [d, m, y] = value.split('.');
    const inputDate = new Date(`${y}-${m}-${d}`);
    const currentDate = new Date();

    currentDate.setDate(currentDate.getDate() + 1);

    currentDate.setHours(0, 0, 0, 0);

    if (inputDate <= currentDate) {
      return false;
    }

    return true;
  },
  $message: () => 'shared.labels.documentDate',
};


export const validateDateFormat = {
  $validator(value: string) {
    if (value.length !== 10) {
      return false;
    }
    const year = getYearByString(value);

    if (Number.isNaN(year)) {
      return false;
    }

    return true;
  },
  $message: () => 'shared.labels.dateFormat',
};

export const validateAge = {
  $validator(value: string) {
    if (value.length !== 10) {
      return false;
    }
    const year = getYearByString(value);
    const currentYear = new Date().getFullYear();

    if (!year || currentYear - year < 18) {
      return false;
    }

    return true;
  },
  $message: () => 'shared.labels.age',
};


export const minLength = helpers.withMessage('shared.labels.minLength', m(10));
export const confirmPassword = (same: string) => helpers.withMessage('shared.labels.confirmPassword', sameAs(same));

export const minLengthFunc = (q: number) => helpers.withMessage('shared.labels.minLength', m(q));

export const minLengthPassword = helpers.withMessage('shared.labels.minLengthPassword', m(8));

export const maxAmount = (amount: number) => helpers.withMessage('shared.labels.maxAmount', mv(amount));

export const required = helpers.withMessage('shared.labels.required', r);
export const email = helpers.withMessage('shared.labels.invalidEmail', e);
export const alpha = helpers.withMessage('shared.labels.onlyAlpha', a);


function getYearByString(value: string) {
  const [d, m, y] = value.split('.');

  return new Date(`${y}-${m}-${d}`).getFullYear();
}