
import type { CourseData } from '~~/types/course.data';
import type { CurrentPositionData } from '~~/types/current.position.data';

export default function () {
  const { $fetchInstance } = useNuxtApp();
  const currentPositionData = useState('current-position-data', () => shallowRef<Nullable<CurrentPositionData>>(null));
  const courseData = useState('course-data', () => shallowRef<Nullable<CourseData>>(null));

  async function getCurrentPosition() {
    try {
      const data = await $fetch<CurrentPositionData>('https://ipapi.co/json/');
      currentPositionData.value = data;
    } catch (error) {
      console.log(error);
    }
  }

  async function getCourseData() {
    try {
      const data = await $fetchInstance<CourseData>('api/currency/course');
      courseData.value = data;
    } catch (error) {
      console.log(error);
    }
  }

  function initConverter() {
    Promise.all([
      getCurrentPosition(),
      getCourseData(),
    ]);
  }

  function convertUsdtInCurrentCurrency(usdt: number) {
    if (!currentPositionData.value || !courseData.value) {
      return null;
    }

    const { currency } = currentPositionData.value;
    const course = courseData.value.usdt[currency.toLocaleLowerCase()];

    if (!course) {
      return null;
    }

    return `≈ ${formatPrice(usdt * course)} ${currency}`;
  }

  return {
    initConverter,
    convertUsdtInCurrentCurrency,
  };
}