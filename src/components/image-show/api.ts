import { getAsBuffer } from '@/utils/request';

import { getItem, setItem, STORE_LEVEL } from '@/storage/base';
import { buffer2Base64 } from '@/utils';

export async function getImage(url: string) {
  let image = getItem(url);
  if (image == null) {
    image = await getAsBuffer('/v2/utils/get-image', { img: url });

    image = buffer2Base64(image);
    setItem(url, image, STORE_LEVEL.SAFE);
  }
  return image;
}
