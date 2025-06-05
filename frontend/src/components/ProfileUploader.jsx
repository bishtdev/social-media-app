import React, { useState } from 'react';
import axios from '../api/axios';
import { useSelector } from 'react-redux';

const ProfileUploader = ({ onUploadSuccess }) => {
  const [image, setImage] = useState(null);
  const { user } = useSelector((state) => state.auth);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('profilePicture', image);

    try {
      const res = await axios.put('/users/upload-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      onUploadSuccess(res.data.profilePicture); // callback
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  return (
    <div className="mt-4 space-y-2">
      <input type="file" onChange={handleFileChange} className="text-white" />
      <button
        onClick={handleUpload}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        Upload Profile Picture
      </button>
    </div>
  );
};

export default ProfileUploader;
