import { getAsBuffer } from '@/utils/request';

import { getItem, setItem, STORE_LEVEL } from '@/storage/base';
import { buffer2Base64 } from '@/utils';

export async function getImage(url: string) {
  if (url == null) throw '错误的地址';

  let image = await getItem(url);
  if (image == null) {
    image = await getAsBuffer('/v2/utils/get-image', { img: url });
    await setItem(url, image, STORE_LEVEL.SAFE);
  }
  image = buffer2Base64(image);
  return image;
}
