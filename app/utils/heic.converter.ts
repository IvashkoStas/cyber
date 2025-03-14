import heic2any from 'heic2any';

const mimeTypes = {
  HEIC: 'image/heic',
  PNG: 'image/png',
};

export async function heicConverter(file: File) {
  if (file.type !== mimeTypes.HEIC) {
    return file;
  }

  const blobURL = URL.createObjectURL(file);
  const blobRes = await fetch(blobURL);
  const blob = await blobRes.blob();
  const conversionResult = await heic2any({
    blob: blob,
    toType: mimeTypes.PNG,
  });


  const convertedFile = new File(
    [conversionResult as Blob],
    `${file.name.split('.').slice(0, -1).join('.')}.png`,
    { type: mimeTypes.PNG, lastModified: Date.now() },
  );

  return convertedFile;
};
