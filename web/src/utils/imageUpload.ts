import type { SupabaseClient } from '@supabase/auth-helpers-react';
import type { CustomFile } from 'src/components/upload';

export type HandleImageUploadArgs = {
  supabaseClient: SupabaseClient<any, "public", any>;
  subdomain: string;
  bucketName: string;
  image: CustomFile;
  oldImagePath?: string;
  prefix?: string;
}

export type HandleImageUploadReturn = {
  data: { imageUrl: string; };
  error: null;
} | {
  data: null;
  error: string;
}

export const handleImageUpload = async ({ supabaseClient, subdomain, bucketName, image, oldImagePath, prefix = '' }: HandleImageUploadArgs): Promise<HandleImageUploadReturn> => {
  const imagePath = `${bucketName}/${prefix}${image.name}`;

  if (oldImagePath) {
    const { data: deleteData, error: deleteError } = await supabaseClient
      .storage
      .from(subdomain)
      .remove([oldImagePath]);

    if (!deleteData || deleteError) return { data: null, error: deleteError.message };
  }

  const { data: uploadData, error: uploadError } = await supabaseClient
    .storage
    .from(subdomain)
    .upload(imagePath, image);

  if (!uploadData || uploadError)  return { data: null, error: uploadError.message };

  const { data: { publicUrl: imageUrl } } = supabaseClient
    .storage
    .from(subdomain)
    .getPublicUrl(uploadData.path);

  return { data: { imageUrl }, error: null };
}
