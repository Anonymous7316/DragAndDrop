import {useCallback, useState, useEffect} from 'react'
import {useDropzone} from 'react-dropzone'
import FileList from './FileList'
import { ActionButton } from './FileCard'

const formatFileSize = (bytes) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
}

const FILE_ICONS = {
    'image/': '🖼️',
    'video/': '🎥',
    'audio/': '🎵',
    'text/': '📄',
    'application/pdf': '📕',
    'application/msword': '📝',
    'application/vnd.openxmlformats-officedocument.wordprocessingml': '📝',
    'application/vnd.ms-excel': '📊',
    'application/vnd.openxmlformats-officedocument.spreadsheetml': '📊',
    'application/vnd.ms-powerpoint': '📽️',
    'application/vnd.openxmlformats-officedocument.presentationml': '📽️',
    'default': '📁'
};

function MyDropzone() {
    const [files, setFiles] = useState([]);
    const [rejectedFiles, setRejectedFiles] = useState([]);
    
    useEffect(() => {
        return () => {
            files.forEach(file => URL.revokeObjectURL(file.preview));
            rejectedFiles.forEach(file => URL.revokeObjectURL(file.preview));
        };
    }, [files, rejectedFiles]);

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        if(acceptedFiles?.length) {
            setFiles(previousFiles => [...previousFiles, ...acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }))]);
        }
        if(rejectedFiles?.length) {
            setRejectedFiles(previousFiles => [...previousFiles, ...rejectedFiles.map(rejection => Object.assign(rejection.file, {
                preview: URL.createObjectURL(rejection.file),
                errors: rejection.errors
            }))]);
        }
    }, []);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, maxSize: 1024 * 1024 * 20})

    const removeFile = (name) => {
        setFiles(files.filter(file => file.name !== name))
    }

    const removeRejectedFile = (name) => {
        setRejectedFiles(rejectedFiles.filter(file => file.name !== name))
    }

    const removeAllFiles = () => {
        setFiles([]);
        setRejectedFiles([]);
    };

    const renderPreview = (file) => {
        if (file.type?.startsWith('image/')) {
            return (
                <img 
                    src={file.preview} 
                    alt={file.name} 
                    style={{
                        width: '100px', 
                        height: '100px', 
                        objectFit: 'cover', 
                        borderRadius: '8px'
                    }}
                />
            );
        }
        
        // Find matching file type icon
        const iconKey = Object.keys(FILE_ICONS).find(key => file.type?.startsWith(key)) || 'default';
        const icon = FILE_ICONS[iconKey];

        return (
            <div style={{
                width: '100px',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                fontSize: '40px'
            }}>
                {icon}
            </div>
        );
    };

    return (
        <form>
            <div {...getRootProps()} style={{padding: '50px', border: '1px dashed #ccc', borderRadius: '5px'}}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag and drop some files here, or click to select files</p>
                }
            </div>
            {files.length > 0 && (
                <>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '20px'
                    }}>
                        <h3 style={{ color: '#28a745', margin: 0 }}>Accepted Files</h3>
                        <ActionButton onClick={removeAllFiles}>
                            Remove All Files
                        </ActionButton>
                    </div>
                    <FileList 
                        files={files}
                        onRemove={removeFile}
                        formatFileSize={formatFileSize}
                        renderPreview={renderPreview}
                    />
                </>
            )}

            {rejectedFiles.length > 0 && (
                <>
                    <div style={{textAlign: 'left'}}>
                        <h3 style={{ marginTop: '20px', color: '#dc3545' }}>Rejected Files</h3>
                    </div>
                    <FileList 
                        files={rejectedFiles}
                        onRemove={removeRejectedFile}
                        formatFileSize={formatFileSize}
                        showErrors={true}
                        gridColumns="repeat(auto-fill, minmax(200px, 1fr))"
                    />
                </>
            )}
        </form>
    )
}

export default MyDropzone