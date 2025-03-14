import type { Kyc } from '~~/types/kyc';
import type { KycDto } from '~~/types/kyc.dto';
import type { User } from '~~/types/user';

export default  function () {
  const { $fetchInstance } = useNuxtApp();
  const { user } = useUser();
  const kyc = computed(() => user.value?.kyc);
  const hasKycImage = useState('kyc-image', () => shallowRef(false));


  const kycImage = useState<Nullable<string>>('kyc-image', () => shallowRef(null));
  const stepPassed = reactive({
    first: computed(() => kyc.value && [kyc.value?.email, kyc.value?.documentCountry, kyc.value?.phone].every((value) => value !== null)),
    second: computed(() => kyc.value && [kyc.value?.firstName, kyc.value?.lastName, kyc.value?.bdate].every((value) => value !== null)),
    third: computed(
      () => kyc.value && [kyc.value?.documentType, kyc.value?.documentNumber, kyc.value?.documentExpireDate].every(
        (value) => value !== null) && hasKycImage.value,
    ),
  });

  function checkPassed(): Nullable<2 | 3> {
    if (stepPassed.first && !stepPassed.second) {
      return 2;
    }

    if (stepPassed.first && stepPassed.second && !stepPassed.third) {
      return 3;
    }

    return null;
  }

  // async function getKyc() {
  //   try {
  //     const data = await $fetchInstance<Kyc>('/api/kyc');
  //     await getKycPhoto();
  //     kyc.value = data;

  //     return data;
  //   } catch (error) {
  //     console.error('get kyc error: ', error);
  //     kyc.value = null;
  //   }
  // }

  // async function sendKyc(body: FormData) {
  //   const data = await $fetchInstance<Kyc>('/api/kyc', {
  //     method: 'POST',
  //     body,
  //   });
  //   kyc.value = data;
  // }

  async function kycRequest() {
    try {
      const data = await $fetchInstance<User>('/api/kyc/request', {
        method: 'POST',
      });
      user.value = data;
    } catch(error: FetchCTX) {
      console.error('post kyc request error: ', error);
      throw new Error(error?.data?.message);
    }
  }

  async function uploadPhoto(file: File) {
    try {
      hasKycImage.value = false;
      const formData = new FormData();
      formData.append('files', file, file.name);
      await $fetchInstance('/api/media/kyc', {
        method: 'POST',
        body: formData,
      });
      hasKycImage.value = true;
    } catch(error: FetchCTX) {
      console.error('send kyc document photo error: ', error);
    }
  }

  async function getKycPhoto() {
    if (!user.value?.id) {
      return;
    }

    try {
      const data = await $fetchInstance<Blob>(`/api/media/kyc/${user.value.id}`);
      const src = URL.createObjectURL(data);

      if (src.startsWith('blob')) {
        kycImage.value = src;
      }
    } catch(error: FetchCTX) {
      console.error('send kyc document photo error: ', error);
    }
  }

  async function patchKyc(body: Partial<KycDto>) {
    try {
      const data = await $fetchInstance<Kyc>('/api/kyc', {
        method: 'PATCH',
        body,
      });

      if (user.value) {
        user.value.kyc = data;
      }

    } catch(error: FetchCTX) {
      console.error('patch kyc error: ', error);
      throw new Error(error?.data?.message);
    }
  }

  return {
    kyc,
    kycImage,
    patchKyc,
    kycRequest,
    checkPassed,
    uploadPhoto,
    getKycPhoto,
    hasKycImage,
    stepPassed,
  };
}
