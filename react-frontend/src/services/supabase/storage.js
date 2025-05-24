import supabase from '../../utils/supabase';

export class StorageService {
  //Upload files to Supabase Storage
  async uploadFile(bucket, filePath, file) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        upsert: true, // Overwrite if file already exists
      });

    if (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }

    return data;
  }

  //Get a public URL for a file in Supabase Storage
  async getUrl(bucket, filePath) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    if (error) {
      throw new Error(`Error getting public URL: ${error.message}`);
    }
    console.log('Data:', data);

    return data.publicUrl;
  }
}

const storage = new StorageService();
export default storage;