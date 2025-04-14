import React, { useState } from 'react';
import axios from "axios";
import { Button, Typography, Box } from "@material-ui/core";

const SystemToolUploadButton = () => {
    //const [file, setFile] = useState<File | null>(null);
    const [file, setFile] = useState({value: __filename, error:""});

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/v1/systemTool/upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.log('Upload successful:', response.data);
            alert('Upload successful!');
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed!');
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <input
                accept=".xlsx,.xls"
                type="file"
                id="upload-file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <label htmlFor="upload-file">
                <Button variant="outlined" component="span">
                    Choose Excel File
                </Button>
            </label>
            {file && <Typography variant="body2">Selected: {file.name}</Typography>}
            <Button variant="contained" color="primary" onClick={handleUpload}>
                Upload
            </Button>
            {/*<Button variant="contained" color="primary" onClick={handleUpload}>*/}
            {/*    Upload*/}
            {/*</Button>*/}
        </Box>
    );
};

export default SystemToolUploadButton;
